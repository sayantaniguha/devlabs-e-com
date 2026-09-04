-- Two additions surfaced by a checkout/admin audit:
--
-- 1. A distinct 'payment_failed' order status: previously, if confirm_paid_order
--    failed (e.g. a stock race lost after the customer already paid via
--    Razorpay), the order stayed 'pending' forever with no way to tell it
--    apart from an order that's simply still waiting on payment. Flagged
--    explicitly here so admins can find and manually refund these.
--
-- 2. restock_cancelled_order: the inverse of confirm_paid_order. Previously
--    marking a paid order 'cancelled'/'refunded' only changed the status
--    label — decremented stock was never returned, and course enrollments
--    granted by the order were never revoked.

-- Drop whatever the status check constraint happens to be named (Postgres
-- auto-names it, and we don't want to hardcode a guess) and recreate it with
-- 'payment_failed' added.
do $$
declare
  r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'orders' and att.attname = 'status' and con.contype = 'c'
  loop
    execute format('alter table public.orders drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'payment_failed'));

-- =========================================================================
-- restock_cancelled_order: call when an order transitions to 'cancelled' or
-- 'refunded'. If stock was ever decremented for this order (i.e. it had
-- reached 'paid' or later), puts it back and revokes any course enrollments
-- the order granted. Idempotent — cancelling an order twice, or an order
-- that never reached 'paid' (nothing to restock), is a safe no-op beyond
-- the status update itself.
-- =========================================================================

create function public.restock_cancelled_order(p_order_id uuid, p_new_status text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_current_status text;
begin
  select status into v_current_status from public.orders where id = p_order_id for update;
  if v_current_status is null then
    return;
  end if;

  -- Stock/enrollments were only ever granted once the order reached 'paid'
  -- (see confirm_paid_order) — anything before that, or already reversed,
  -- has nothing to give back.
  if v_current_status in ('paid', 'processing', 'shipped', 'delivered') then
    update public.product_variants pv
    set stock_quantity = pv.stock_quantity + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id
      and oi.item_type = 'product'
      and oi.variant_id = pv.id;

    delete from public.enrollments where order_id = p_order_id;
  end if;

  update public.orders set status = p_new_status where id = p_order_id;
end;
$$;

revoke all on function public.restock_cancelled_order(uuid, text) from public;
grant execute on function public.restock_cancelled_order(uuid, text) to service_role;
