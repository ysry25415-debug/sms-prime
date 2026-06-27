"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseAnonKey, requireSupabaseUrl } from "@/lib/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(requireSupabaseUrl(), requireSupabaseAnonKey());
}
