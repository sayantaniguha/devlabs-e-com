"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signIn(formData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.message };
  }

  redirect("/account");
}

const signUpSchema = credentialsSchema.extend({
  fullName: z.string().trim().min(1, "Name is required"),
});

export async function signUp(formData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });
  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await linkGuestOrders(data.user.id, parsed.data.email);
  }

  redirect("/account");
}

// Claims any past guest orders placed under this email so a new account
// immediately sees its order history — writes go through the admin client
// since orders have no client-side update policy (service-role only).
async function linkGuestOrders(userId, email) {
  const supabase = createAdminClient();
  await supabase
    .from("orders")
    .update({ user_id: userId })
    .is("user_id", null)
    .ilike("guest_email", email);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
