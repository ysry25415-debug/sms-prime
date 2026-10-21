"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type ProviderResponse =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

type LiveService = {
  code: string;
  name: string;
  country: string;
  price: number;
  stock: number;
};

const serviceNames: Record<string, string> = {
  wa: "WhatsApp",
  tg: "Telegram",
  go: "Google",
  fb: "Facebook",
  ig: "Instagram",
  ds: "Discord",
  ub: "Uber",
  av: "Avito"
};

const countryNames: Record<string, string> = {
  "0": "Russia",
  "1": "Ukraine",
  "2": "Kazakhstan",
  "6": "Indonesia",
  "10": "United States",
  "16": "United Kingdom",
  "33": "Egypt",
  "40": "Germany",
  "73": "Brazil"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalisePrices(data: Record<string, unknown>): LiveService[] {
  const rows: LiveService[] = [];

  for (const [serviceCode, countries] of Object.entries(data)) {
    if (!isRecord(countries)) continue;

    for (const [countryCode, availability] of Object.entries(countries)) {
      if (!isRecord(availability)) continue;

      const price = toFiniteNumber(availability.cost ?? availability.price);
      const stock = toFiniteNumber(availability.count ?? availability.stock ?? availability.qty);

      if (price === undefined || stock === undefined || stock < 1) continue;

      rows.push({
        code: serviceCode,
        name: serviceNames[serviceCode] ?? serviceCode.toUpperCase(),
        country: countryNames[countryCode] ?? `Country ${countryCode}`,
        price,
        stock
      });
    }
  }

  return rows.sort((left, right) => right.stock - left.stock || left.price - right.price).slice(0, 8);
}

async function fetchServices(): Promise<LiveService[]> {
  const response = await fetch("/api/providers/smsbower?action=getPrices", {
    method: "GET",
    cache: "no-store"
  });
  const payload = (await response.json()) as ProviderResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.ok ? "SMSBower returned an invalid response." : payload.error);
  }

  return normalisePrices(payload.data);
}

export function ServiceTable() {
  const query = useQuery({
    queryKey: ["smsbower", "prices"],
    queryFn: fetchServices,
    staleTime: 60_000,
    retry: false
  });

  const services = query.data ?? [];
  const error = query.error instanceof Error ? query.error.message : null;

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-4 border-b border-white/8 p-5">
        <div>
          <CardTitle>Popular services</CardTitle>
          <CardDescription>Live prices and availability from SMSBower.</CardDescription>
        </div>
        <Button variant="secondary" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>
          <RefreshCcw className="h-4 w-4" />
          {query.isFetching ? "Loading" : "Refresh"}
        </Button>
      </div>

      {query.isLoading ? (
        <div className="p-10 text-center text-sm text-muted">Loading live services from SMSBower...</div>
      ) : error ? (
        <div className="m-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Live services could not be loaded.</p>
            <p className="mt-1 text-amber-100/80">
              {error.includes("SMSBOWER_API_KEY")
                ? "Add SMSBOWER_API_KEY to Vercel as a Secret, select Production, then redeploy."
                : error}
            </p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted">SMSBower returned no available services right now. Try refreshing shortly.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={`${service.code}-${service.country}`} className="border-t border-white/8">
                  <td className="px-5 py-4 text-sm font-medium text-text">{service.name}</td>
                  <td className="px-5 py-4 text-sm text-muted">{service.country}</td>
                  <td className="px-5 py-4 text-sm text-text">${service.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm text-text">{service.stock.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <Badge variant={service.stock < 10 ? "warning" : "success"}>
                      {service.stock < 10 ? "Limited" : "Available"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
