-- DevLabs e-commerce — initial schema
-- Run once in the Supabase SQL Editor (or `supabase db push` if you use the CLI).

-- =========================================================================
-- Tables
-- =========================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories (id),
  base_price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  status text not null default 'draft' check (status in ('active', 'draft')),
  created_at timestamptz not null default now()
);
create index products_category_id_idx on public.products (category_id);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text,
  color text,
  sku text unique,
  price_override numeric(10, 2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now()
);
create index product_variants_product_id_idx on public.product_variants (product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  position integer not null default 0,
  is_primary boolean not null default false
);
create index product_images_product_id_idx on public.product_images (product_id);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  thumbnail_url text,
  status text not null default 'draft' check (status in ('active', 'draft')),
  created_at timestamptz not null default now()
);

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  video_url text,
  position integer not null default 0,
  is_preview boolean not null default false
);
create index course_lessons_course_id_idx on public.course_lessons (course_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  guest_email text,
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10, 2) not null default 0,
  shipping_total numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  shipping_address_id uuid references public.addresses (id),
  created_at timestamptz not null default now(),
  constraint orders_has_identity check (user_id is not null or guest_email is not null)
);
create index orders_user_id_idx on public.orders (user_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  item_type text not null check (item_type in ('product', 'course')),
  variant_id uuid references public.product_variants (id),
  course_id uuid references public.courses (id),
  name_snapshot text not null,
  variant_label_snapshot text,
  unit_price_snapshot numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  constraint order_items_item_shape check (
    (item_type = 'product' and variant_id is not null and course_id is null) or
    (item_type = 'course' and course_id is not null and variant_id is null)
  )
);
create index order_items_order_id_idx on public.order_items (order_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  gateway text not null default 'razorpay',
  gateway_order_id text,
  gateway_payment_id text,
  status text not null,
  amount numeric(10, 2) not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);
create index payments_order_id_idx on public.payments (order_id);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  order_id uuid references public.orders (id),
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- =========================================================================
-- New-user hook: every auth.users row gets a matching profiles row
-- =========================================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- confirm_paid_order: the sole function that marks an order paid, decrements
-- stock, and grants course enrollments. Called (via the service-role client,
-- after signature verification) from two places: the Razorpay webhook
-- handler, and the client-redirect confirmation path in
-- lib/actions/checkout.js — the latter confirms immediately on checkout
-- success without waiting on webhook delivery, with the webhook as a durable
-- backstop. Idempotent — re-running it on an already-paid order is a no-op,
-- so either path (or both) running for the same order can never
-- double-decrement stock or double-enroll a course.
-- =========================================================================

create function public.confirm_paid_order(p_order_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_item record;
begin
  if not exists (select 1 from public.orders where id = p_order_id and status = 'pending') then
    return;
  end if;

  -- Lock every affected variant row and verify stock before mutating anything.
  for v_item in
    select oi.variant_id, oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and oi.item_type = 'product'
  loop
    perform 1 from public.product_variants
      where id = v_item.variant_id and stock_quantity >= v_item.quantity
      for update;
    if not found then
      raise exception 'insufficient stock for variant %', v_item.variant_id;
    end if;
  end loop;

  update public.product_variants pv
  set stock_quantity = pv.stock_quantity - oi.quantity
  from public.order_items oi
  where oi.order_id = p_order_id
    and oi.item_type = 'product'
    and oi.variant_id = pv.id;

  update public.orders set status = 'paid' where id = p_order_id;

  insert into public.enrollments (user_id, course_id, order_id)
  select o.user_id, oi.course_id, o.id
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where oi.order_id = p_order_id
    and oi.item_type = 'course'
    and o.user_id is not null
  on conflict (user_id, course_id) do nothing;
end;
$$;

revoke all on function public.confirm_paid_order(uuid) from public;
grant execute on function public.confirm_paid_order(uuid) to service_role;

-- =========================================================================
-- Row Level Security
--
-- Design: every write that matters (admin product/course/category CRUD,
-- order/payment/enrollment creation, stock changes) goes through trusted
-- server code using the service-role key, which bypasses RLS entirely —
-- so those tables intentionally have NO insert/update/delete policy for
-- the anon/authenticated roles. That makes it impossible for a client to
-- forge an order, grant itself a course, or edit the catalog directly,
-- without needing a parallel set of "is this user an admin" policies.
-- Catalog tables are readable by anyone (storefront browsing); everything
-- else is readable only by its owner.
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.enrollments enable row level security;

-- profiles: read own row only. No client-side update policy — if profile
-- editing (e.g. display name) is added later, do it via a server action
-- that whitelists fields, so a user can never set their own `role`.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- addresses: fully owner-managed from the client.
create policy "addresses_all_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Catalog: public read, admin-only write via service role (no policy needed).
create policy "categories_select_all" on public.categories for select using (true);
create policy "products_select_all" on public.products for select using (true);
create policy "product_variants_select_all" on public.product_variants for select using (true);
create policy "product_images_select_all" on public.product_images for select using (true);
create policy "courses_select_all" on public.courses for select using (true);
create policy "course_lessons_select_all" on public.course_lessons for select using (true);

-- Orders/payments/enrollments: read own only; all writes are service-role only.
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);
create policy "order_items_select_own" on public.order_items
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));
create policy "payments_select_own" on public.payments
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));
create policy "enrollments_select_own" on public.enrollments
  for select using (auth.uid() = user_id);
