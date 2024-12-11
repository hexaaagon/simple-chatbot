"use server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUrl(supabase: SupabaseClient, path: string) {
  const publicUrl = supabase.storage.from("images").getPublicUrl(path)
    .data.publicUrl;

  return publicUrl;
}
