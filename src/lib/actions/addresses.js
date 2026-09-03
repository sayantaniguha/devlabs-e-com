"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addressSchema } from "@/lib/validations/account";

export async function createAddress(_prevState, formData) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "You must be logged in." };

  const parsed = addressSchema.safeParse({
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { error } = await supabase.from("addresses").insert({
    user_id: profile.id,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postal_code: parsed.data.postalCode,
    phone: parsed.data.phone || null,
    is_default: (count ?? 0) === 0,
  });
  if (error) return { error: "Could not save address." };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddress(_prevState, formData) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "You must be logged in." };

  const parsed = addressSchema.safeParse({
    id: formData.get("id"),
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .update({
      line1: parsed.data.line1,
      line2: parsed.data.line2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postalCode,
      phone: parsed.data.phone || null,
    })
    .eq("id", parsed.data.id);
  if (error) return { error: "Could not update address." };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(id) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "You must be logged in." };

  const supabase = await createClient();
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) return { error: "Could not delete address." };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function setDefaultAddress(id) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "You must be logged in." };

  const supabase = await createClient();
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", profile.id);
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id);
  if (error) return { error: "Could not set default address." };

  revalidatePath("/account/addresses");
  return { success: true };
}
