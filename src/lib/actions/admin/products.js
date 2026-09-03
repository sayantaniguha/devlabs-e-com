"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/slugify";
import { productSchema } from "@/lib/validations/admin";

async function uniqueSlug(supabase, name, excludeId) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  for (;;) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${suffix++}`;
  }
}

function productFields(data) {
  return {
    name: data.name,
    description: data.description || null,
    category_id: data.category_id,
    base_price: data.base_price,
    compare_at_price: data.compare_at_price || null,
    status: data.status,
  };
}

export async function createProduct(input) {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const slug = await uniqueSlug(supabase, parsed.data.name);

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...productFields(parsed.data), slug })
    .select("id, slug")
    .single();
  if (error) return { error: "Could not create product." };

  const { error: variantsError } = await supabase
    .from("product_variants")
    .insert(
      parsed.data.variants.map((v) => ({
        product_id: product.id,
        size: v.size || null,
        sku: v.sku || null,
        stock_quantity: v.stock_quantity,
      })),
    );
  if (variantsError) return { error: "Could not save variants." };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { id: product.id };
}

export async function updateProduct(input) {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!parsed.data.id) return { error: "Missing product id." };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update(productFields(parsed.data))
    .eq("id", parsed.data.id);
  if (error) return { error: "Could not update product." };

  const { data: existingVariants } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", parsed.data.id);
  const existingIds = new Set((existingVariants ?? []).map((v) => v.id));
  const submittedIds = new Set(
    parsed.data.variants.filter((v) => v.id).map((v) => v.id),
  );

  const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
  const toUpdate = parsed.data.variants.filter((v) => v.id);
  const toInsert = parsed.data.variants.filter((v) => !v.id);

  if (toDelete.length) {
    await supabase.from("product_variants").delete().in("id", toDelete);
  }
  for (const v of toUpdate) {
    await supabase
      .from("product_variants")
      .update({
        size: v.size || null,
        sku: v.sku || null,
        stock_quantity: v.stock_quantity,
      })
      .eq("id", v.id);
  }
  if (toInsert.length) {
    await supabase.from("product_variants").insert(
      toInsert.map((v) => ({
        product_id: parsed.data.id,
        size: v.size || null,
        sku: v.sku || null,
        stock_quantity: v.stock_quantity,
      })),
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { id: parsed.data.id };
}

export async function deleteProduct(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);
  const paths = (images ?? [])
    .map((img) => img.url.split("/product-images/")[1])
    .filter(Boolean);
  if (paths.length) {
    await supabase.storage.from("product-images").remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "Could not delete product." };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function addProductImage(productId, url) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url,
    position: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });
  if (error) return { error: "Could not save image." };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function removeProductImage(imageId) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("product_id, url, is_primary")
    .eq("id", imageId)
    .maybeSingle();
  if (!image) return { error: "Image not found." };

  const path = image.url.split("/product-images/")[1];
  if (path) await supabase.storage.from("product-images").remove([path]);
  await supabase.from("product_images").delete().eq("id", imageId);

  if (image.is_primary) {
    const { data: next } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", image.product_id)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", next.id);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function setPrimaryImage(productId, imageId) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
