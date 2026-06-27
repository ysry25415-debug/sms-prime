# SMSPrime

Premium SMS verification dashboard scaffold built with Next.js, TypeScript, Tailwind CSS, Prisma, and Supabase.

## Included

- Dark premium SaaS landing page
- Auth pages wired to Supabase Auth
- Protected dashboard layout
- SMSBower provider adapter
- Internal provider API routes
- Webhook endpoint for incoming SMS
- Prisma schema for users, subscriptions, wallet transactions, orders, messages, API keys, and support tickets

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL` optional, but recommended for Prisma migrations
- `SMSBOWER_API_KEY`

## Notes

- The Supabase URL and publishable key are already prepared locally.
- `DATABASE_URL` must be the PostgreSQL connection string from Supabase "Connect", not the REST endpoint ending in `/rest/v1/`.
- If you use the Supabase pooler, keep `DATABASE_URL` pointed at the pooler host and set `DIRECT_URL` to the direct Postgres host.
- The SMSBower file you provided includes the API key in masked form, so the provider integration is ready but cannot be tested until the full key is added.
- Run `npm install`, then `npm run dev`.
