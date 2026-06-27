import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Read-only in server components. Session refresh is handled in middleware.
      },
      remove() {
        // Read-only in server components. Session refresh is handled in middleware.
      }
    }
  });
}
