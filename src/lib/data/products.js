import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"];

const PRODUCT_SELECT =
  "*, category:categories(id, name, slug), images:product_images(url, position, is_primary), variants:product_variants(id, size, sku, stock_quantity)";

function sortVariants(variants) {
  return [...(variants ?? [])].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size);
    const bi = SIZE_ORDER.indexOf(b.size);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function decorate(product) {
  const variants = sortVariants(product.variants);
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
  const images = [...(product.images ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const primaryImage =
    images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null;

  return { ...product, variants, images, totalStock, primaryImage };
}

// These reads are public and identical for every caller (always scoped to
// status = "active"), so they're cached indefinitely via the admin client
// (unstable_cache can't wrap the cookie-scoped client — it disallows
// dynamic APIs like cookies() inside) and invalidated on demand via
// revalidateTag("products") / revalidateTag("categories") from the admin
// product/category actions and from the checkout payment-confirmation path
// (stock changes there too, not just in admin).

export const getCategories = unstable_cache(
  async function getCategories() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    if (error) throw error;
    return data;
  },
  ["categories"],
  { tags: ["categories"] },
);

export const getProducts = unstable_cache(
  async function getProducts({
    category,
    search,
    sort = "newest",
    maxPrice,
    size,
    inStockOnly,
  } = {}) {
    const supabase = createAdminClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (maxPrice != null) {
      query = query.lte("base_price", maxPrice);
    }
    if (sort === "price-asc") {
      query = query.order("base_price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("base_price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    // Tiebreaker: rows with equal created_at/price (e.g. a batch-seeded
    // catalog) would otherwise come back in a non-deterministic order.
    query = query.order("id", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    // Filtered in JS rather than via a joined-column `.eq()` — the catalog is
    // small, and it sidesteps PostgREST's inner-join requirement for
    // filtering on embedded resources.
    let products = data.map(decorate);

    if (category?.length) {
      const categories = Array.isArray(category) ? category : [category];
      products = products.filter((p) => categories.includes(p.category?.slug));
    }
    if (size) {
      products = products.filter((p) =>
        p.variants.some((v) => v.size === size),
      );
    }
    if (inStockOnly) {
      products = products.filter((p) => p.totalStock > 0);
    }

    return products;
  },
  ["products"],
  { tags: ["products"] },
);

export const getProductBySlug = unstable_cache(
  async function getProductBySlug(slug) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return decorate(data);
  },
  ["product-by-slug"],
  { tags: ["products"] },
);

export const getRelatedProducts = unstable_cache(
  async function getRelatedProducts(categoryId, excludeProductId, limit = 4) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .eq("category_id", categoryId)
      .neq("id", excludeProductId)
      .limit(limit);
    if (error) throw error;
    return data.map(decorate);
  },
  ["related-products"],
  { tags: ["products"] },
);
