type MaybeString = string | undefined;

function pick(...values: MaybeString[]) {
  return values.find((value) => typeof value === "string" && value.length > 0);
}

function requireValue(name: string, value: MaybeString) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  appUrl: pick(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: requireValue(
    "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
    pick(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL)
  ),
  supabaseAnonKey: requireValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY",
    pick(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, process.env.SUPABASE_ANON_KEY)
  ),
  smsBowerBaseUrl:
    pick(process.env.SMSBOWER_BASE_URL) ?? "https://smsbower.page/stubs/handler_api.php",
  smsBowerApiKey: process.env.SMSBOWER_API_KEY,
  smsBowerWebhookIp: pick(process.env.SMSBOWER_WEBHOOK_IP) ?? "167.235.198.205"
} as const;

export function requireDatabaseUrl() {
  return requireValue("DATABASE_URL", env.databaseUrl);
}

export function requireSmsBowerApiKey() {
  return requireValue("SMSBOWER_API_KEY", env.smsBowerApiKey);
}
