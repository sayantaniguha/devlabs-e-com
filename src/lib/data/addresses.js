import "server-only";
import { createClient } from "@/lib/supabase/server";

// RLS ("addresses_all_own") scopes this to the caller's own rows.
export async function getMyAddresses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
