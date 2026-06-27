export const stats = [
  { label: "Wallet balance", value: "$2,480.90", delta: "+12.4%", tone: "success" },
  { label: "Active orders", value: "24", delta: "+3 today", tone: "primary" },
  { label: "SMS delivered", value: "1,842", delta: "98.7% success", tone: "success" },
  { label: "API latency", value: "182ms", delta: "Stable", tone: "warning" }
] as const;

export const providers = [
  { name: "SMS Bower", status: "Operational", uptime: "99.98%", latency: "164ms" },
  { name: "GlobalVerify", status: "Operational", uptime: "99.92%", latency: "191ms" },
  { name: "PrimeRoute", status: "Degraded", uptime: "97.40%", latency: "310ms" }
] as const;

export const services = [
  { name: "Telegram", country: "Egypt", price: "$0.42", stock: 128, status: "Hot" },
  { name: "WhatsApp", country: "India", price: "$0.55", stock: 91, status: "Available" },
  { name: "Google", country: "Brazil", price: "$0.61", stock: 47, status: "Limited" },
  { name: "Facebook", country: "Indonesia", price: "$0.38", stock: 214, status: "Available" }
] as const;

export const messages = [
  {
    service: "Telegram",
    number: "+20 10 1234 5678",
    code: "482931",
    country: "Egypt",
    provider: "SMS Bower",
    time: "2 min ago",
    status: "Delivered"
  },
  {
    service: "WhatsApp",
    number: "+91 98765 43210",
    code: "219044",
    country: "India",
    provider: "PrimeRoute",
    time: "5 min ago",
    status: "Pending"
  }
] as const;

export const orders = [
  {
    id: "SP-1024",
    service: "Telegram",
    country: "Egypt",
    number: "+20 10 1234 5678",
    provider: "SMS Bower",
    price: "$0.42",
    status: "Active",
    expires: "09:58"
  },
  {
    id: "SP-1025",
    service: "WhatsApp",
    country: "India",
    number: "+91 98765 43210",
    provider: "PrimeRoute",
    price: "$0.55",
    status: "Pending",
    expires: "04:15"
  },
  {
    id: "SP-1026",
    service: "Google",
    country: "Brazil",
    number: "+55 11 99888 7766",
    provider: "GlobalVerify",
    price: "$0.61",
    status: "Completed",
    expires: "00:00"
  }
] as const;

export const activity = [
  "Telegram number purchased for Egypt",
  "Wallet deposit confirmed",
  "Webhook message received from provider",
  "Subscription renewed successfully"
] as const;
