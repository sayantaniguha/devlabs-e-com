import "server-only";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PRODUCT_SELECT =
  "*, category:categories(id, name, slug), images:product_images(id, url, position, is_primary), variants:product_variants(id, size, sku, stock_quantity, price_override)";

// "Counted" order statuses: a real payment has happened. Excludes 'pending'
// (payment never completed) so abandoned checkouts don't inflate revenue.
const PAID_STATUSES = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "refunded",
];
const ACTIVE_STATUSES = ["paid", "processing", "shipped"];

function monthBounds(monthsAgo) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return { start, end };
}

function percentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function getDashboardStats() {
  const supabase = createAdminClient();
  const thisMonth = monthBounds(0);
  const lastMonth = monthBounds(1);

  const [
    { data: salesThis },
    { data: salesLast },
    { count: activeOrdersCount },
    { count: ordersThisMonth },
    { count: ordersLastMonth },
    { count: customersThisMonth },
    { count: customersLastMonth },
    { data: recentOrdersRaw },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .in("status", PAID_STATUSES)
      .gte("created_at", thisMonth.start.toISOString())
      .lt("created_at", thisMonth.end.toISOString()),
    supabase
      .from("orders")
      .select("total")
      .in("status", PAID_STATUSES)
      .gte("created_at", lastMonth.start.toISOString())
      .lt("created_at", lastMonth.end.toISOString()),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ACTIVE_STATUSES),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .neq("status", "cancelled")
      .gte("created_at", thisMonth.start.toISOString())
      .lt("created_at", thisMonth.end.toISOString()),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .neq("status", "cancelled")
      .gte("created_at", lastMonth.start.toISOString())
      .lt("created_at", lastMonth.end.toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "customer")
      .gte("created_at", thisMonth.start.toISOString())
      .lt("created_at", thisMonth.end.toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "customer")
      .gte("created_at", lastMonth.start.toISOString())
      .lt("created_at", lastMonth.end.toISOString()),
    supabase
      .from("orders")
      .select(
        "id, order_number, total, status, created_at, user_id, guest_email, profile:profiles(full_name), order_items(name_snapshot, quantity)",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.rpc("get_low_stock_products", { p_limit: 4 }),
  ]);

  const totalSalesThisMonth = (salesThis ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );
  const totalSalesLastMonth = (salesLast ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  const revenueLast7Days = await getRevenueLast7Days(supabase);

  const inventoryStatus = (lowStockProducts ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    totalStock: p.total_stock,
  }));

  const recentOrders = (recentOrdersRaw ?? []).map((o) => {
    const firstItem = o.order_items?.[0];
    const label = firstItem
      ? o.order_items.length > 1
        ? `${firstItem.name_snapshot} +${o.order_items.length - 1} more`
        : firstItem.quantity > 1
          ? `${firstItem.name_snapshot} x${firstItem.quantity}`
          : firstItem.name_snapshot
      : "—";
    return {
      id: o.id,
      order_number: o.order_number,
      customerName: o.profile?.full_name ?? o.guest_email ?? "Guest",
      productLabel: label,
      total: o.total,
      status: o.status,
      created_at: o.created_at,
    };
  });

  return {
    totalSalesThisMonth,
    salesChangePercent: percentChange(totalSalesThisMonth, totalSalesLastMonth),
    activeOrdersCount: activeOrdersCount ?? 0,
    activeOrdersChangePercent: percentChange(
      ordersThisMonth ?? 0,
      ordersLastMonth ?? 0,
    ),
    newCustomersThisMonth: customersThisMonth ?? 0,
    customersChangePercent: percentChange(
      customersThisMonth ?? 0,
      customersLastMonth ?? 0,
    ),
    revenueLast7Days,
    inventoryStatus,
    recentOrders,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };
}

async function getRevenueLast7Days(supabase) {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    days.push(day);
  }
  const rangeStart = days[0];
  const rangeEnd = new Date(days[6]);
  rangeEnd.setDate(rangeEnd.getDate() + 1);

  const { data } = await supabase
    .from("orders")
    .select("total, created_at")
    .in("status", PAID_STATUSES)
    .gte("created_at", rangeStart.toISOString())
    .lt("created_at", rangeEnd.toISOString());

  const totalsByDay = days.map(() => 0);
  for (const order of data ?? []) {
    const created = new Date(order.created_at);
    const idx = days.findIndex(
      (d) =>
        d.getFullYear() === created.getFullYear() &&
        d.getMonth() === created.getMonth() &&
        d.getDate() === created.getDate(),
    );
    if (idx !== -1) totalsByDay[idx] += Number(order.total);
  }

  return days.map((day, i) => ({
    label: day.toLocaleDateString("en-US", { weekday: "short" }),
    total: totalsByDay[i],
  }));
}

export async function getAdminProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAdminProductById(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminOrders({ status, search } = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, total, status, created_at, guest_email, profile:profiles(full_name, email)",
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.ilike("order_number", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAdminOrderById(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, profile:profiles(full_name, email), order_items(*), payments(*)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminCourses() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, lessons:course_lessons(id)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAdminCourseById(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, lessons:course_lessons(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    lessons: [...(data.lessons ?? [])].sort((a, b) => a.position - b.position),
  };
}
