-- getDashboardStats() was pulling every row of product_variants into JS just
-- to sum stock per product and keep the lowest 4 — fine at today's catalog
-- size, but it loads the entire table on every dashboard view regardless.
-- Pushes the aggregation into SQL instead.

create function public.get_low_stock_products(p_limit int default 4)
returns table(id uuid, name text, total_stock bigint)
language sql
stable
security definer set search_path = public
as $$
  select p.id, p.name, coalesce(sum(pv.stock_quantity), 0)::bigint as total_stock
  from public.products p
  join public.product_variants pv on pv.product_id = p.id
  group by p.id, p.name
  order by total_stock asc
  limit p_limit;
$$;

revoke all on function public.get_low_stock_products(int) from public;
grant execute on function public.get_low_stock_products(int) to service_role;
