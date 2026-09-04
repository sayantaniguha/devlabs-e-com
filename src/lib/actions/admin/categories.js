"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/slugify";
import { categorySchema } from "@/lib/validations/admin";

export async function createCategory(_prevState, formData) {
  await requireAdmin();
  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug: slugify(parsed.data.name) });
  if (error)
    return { error: "Could not create category (name may already exist)." };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  // Product listings embed each product's category name/slug, so a rename
  // or delete here must invalidate the products cache too.
  revalidateTag("products");
  return { success: true };
}

export async function updateCategory(_prevState, formData) {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id);
  if (error) return { error: "Could not update category." };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  // Product listings embed each product's category name/slug, so a rename
  // or delete here must invalidate the products cache too.
  revalidateTag("products");
  return { success: true };
}

export async function deleteCategory(id) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return {
      error: "Could not delete category — it may still have products assigned.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  // Product listings embed each product's category name/slug, so a rename
  // or delete here must invalidate the products cache too.
  revalidateTag("products");
  return { success: true };
}
