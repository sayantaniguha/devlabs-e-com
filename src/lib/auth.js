import "server-only";
import { createClient } from "@/lib/supabase/server";

// Server-only helpers for reading the current session + role.
// Use in Server Components, Server Actions, and Route Handlers.

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  return profile ?? null;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Admin access required");
  }
  return profile;
}
