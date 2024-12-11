"use server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function initBucket(supabase: SupabaseClient) {
  const buckets = await supabase.storage.listBuckets();
  if (buckets.error)
    return {
      success: false,
      error: buckets.error,
    };

  if (buckets.data.length > 0)
    return {
      success: true,
    };

  const bucket = await supabase.storage.createBucket("images", {
    public: true,
  });

  if (bucket.error)
    return {
      success: false,
      error: bucket.error,
    };

  return {
    success: true,
  };
}
