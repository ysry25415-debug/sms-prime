export const stats = [
  { label: "Wallet balance", value: "$0.00", delta: "No deposits yet", tone: "neutral" },
  { label: "Active orders", value: "0", delta: "No active orders", tone: "neutral" },
  { label: "SMS delivered", value: "0", delta: "Waiting for first order", tone: "neutral" },
  { label: "API status", value: "Setup", delta: "Add provider key in Vercel", tone: "warning" }
] as const;

export const providers = [
  { name: "SMSBower", status: "Needs API key", detail: "Configure SMSBOWER_API_KEY in Vercel to enable live provider data." },
  { name: "Supabase Auth", status: "Connected", detail: "Accounts and sessions are handled through Supabase." },
  { name: "Database", status: "Ready", detail: "Prisma models are prepared for orders, wallets, messages, and tickets." }
] as const;

export const services: Array<{
  name: string;
  country: string;
  price: string;
  stock: number;
  status: string;
}> = [];

export const messages: Array<{
  service: string;
  number: string;
  code: string;
  country: string;
  provider: string;
  time: string;
  status: string;
}> = [];

export const orders: Array<{
  id: string;
  service: string;
  country: string;
  number: string;
  provider: string;
  price: string;
  status: string;
  expires: string;
}> = [];

export const activity = [
  "Create an account and confirm your email.",
  "Add SMSBower API key in Vercel environment variables.",
  "Connect a payment gateway before accepting wallet deposits.",
  "Your first real order will appear here after purchasing a number."
] as const;
