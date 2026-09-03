-- Checkout support: snapshot shipping details directly on the order
-- (rather than an FK to a user-owned `addresses` row) so guest checkout
-- works — a guest has no profile to own an address row with — and so a
-- later edit/delete of a saved address never rewrites a past order's
-- shipping details. Also adds a random confirmation token so a guest
-- (no auth session) can view their own order-success page via a
-- capability URL instead of an RLS-gated "owner" query.

alter table public.orders
  drop column if exists shipping_address_id;

alter table public.orders
  add column shipping_name text,
  add column shipping_phone text,
  add column shipping_line1 text,
  add column shipping_line2 text,
  add column shipping_city text,
  add column shipping_state text,
  add column shipping_postal_code text,
  add column shipping_country text not null default 'IN',
  add column confirmation_token uuid not null default gen_random_uuid();

create index orders_confirmation_token_idx on public.orders (confirmation_token);
