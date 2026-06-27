import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(_name: string, _value: string, _options: Parameters<typeof cookieStore.set>[2]) {
        // Read-only in server components. Session refresh is handled in middleware.
      },
      remove(_name: string, _options: Parameters<typeof cookieStore.set>[2]) {
        // Read-only in server components. Session refresh is handled in middleware.
      }
    }
  });
}
