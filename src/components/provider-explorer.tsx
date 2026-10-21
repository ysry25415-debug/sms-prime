"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Service = { code: string; name: string };
type Country = { id: string; name: string };
type ProviderResponse<T> = { ok: true; data: T } | { ok: false; error: string };
type Price = { cost?: number | string; count?: number | string; price?: number | string; stock?: number | string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

async function getProvider<T>(action: string): Promise<T> {
  const response = await fetch(`/api/providers/smsbower?action=${action}`, { cache: "no-store" });
  const payload = (await response.json()) as ProviderResponse<T>;
  if (!response.ok || !payload.ok) throw new Error(payload.ok ? "The provider response could not be read." : payload.error);
  return payload.data;
}

function normaliseCountries(data: unknown): Country[] {
  const source = Array.isArray(data) ? data : isRecord(data) ? Object.values(data) : [];
  return source.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = item.id ?? item.country;
    const name = item.eng ?? item.name ?? item.rus;
    return id !== undefined && typeof name === "string" ? [{ id: String(id), name }] : [];
  });
}

function readPrice(data: unknown, country: string, service: string) {
  if (!isRecord(data)) return undefined;
  const countryPrices = data[country];
  if (!isRecord(countryPrices)) return undefined;
  const entry = countryPrices[service];
  if (!isRecord(entry)) return undefined;
  return {
    price: asNumber((entry as Price).cost ?? (entry as Price).price),
    stock: asNumber((entry as Price).count ?? (entry as Price).stock)
  };
}

export function ProviderExplorer({ compact = false }: { compact?: boolean }) {
  const servicesQuery = useQuery({ queryKey: ["smsbower", "services"], queryFn: () => getProvider<{ services?: Service[] }>("getServicesList"), staleTime: 300_000, retry: false });
  const countriesQuery = useQuery({ queryKey: ["smsbower", "countries"], queryFn: () => getProvider<unknown>("getCountries"), staleTime: 300_000, retry: false });
  const [service, setService] = useState("");
  const [country, setCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const services = servicesQuery.data?.services ?? [];
  const countries = useMemo(() => normaliseCountries(countriesQuery.data), [countriesQuery.data]);
  const pricesQuery = useQuery({
    queryKey: ["smsbower", "price", service, country, submitted],
    queryFn: () => getProvider<Record<string, unknown>>(`getPrices&service=${encodeURIComponent(service)}&country=${encodeURIComponent(country)}`),
    enabled: submitted && Boolean(service) && Boolean(country),
    retry: false
  });
  const quote = readPrice(pricesQuery.data, country, service);
  const loadingCatalog = servicesQuery.isLoading || countriesQuery.isLoading;
  const catalogError = servicesQuery.error ?? countriesQuery.error;
  const canCheck = Boolean(service && country) && !pricesQuery.isFetching;

  return (
    <section className={`border border-border bg-white p-5 ${compact ? "rounded-xl" : "rounded-xl"}`} aria-label="Check service availability">
      <div className="flex items-start justify-between gap-5">
        <div><h2 className="text-lg font-semibold tracking-[-0.02em] text-text">Check availability</h2><p className="mt-1 text-sm text-muted">Live data is requested only after you choose both fields.</p></div>
        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#E5B928]" aria-label="Live provider connection" />
      </div>
      {loadingCatalog ? <div className="mt-8 flex items-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading catalog</div> : null}
      {catalogError ? <p className="mt-6 text-sm text-danger">The catalog could not be loaded. Check the provider configuration and try again.</p> : null}
      {!loadingCatalog && !catalogError ? <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-text">Service<select value={service} onChange={(event) => { setService(event.target.value); setSubmitted(false); }} className="mt-2 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text outline-none focus:border-[#B38E17]"><option value="">Choose a service</option>{services.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
        <label className="text-sm font-medium text-text">Country<select value={country} onChange={(event) => { setCountry(event.target.value); setSubmitted(false); }} className="mt-2 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text outline-none focus:border-[#B38E17]"><option value="">Choose a country</option>{countries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      </div> : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button disabled={!canCheck} onClick={() => setSubmitted(true)}>{pricesQuery.isFetching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Check availability</Button>
        {submitted && quote?.price !== undefined && quote.stock !== undefined ? <p className="text-sm text-text"><span className="font-semibold">${quote.price.toFixed(2)}</span> · {quote.stock.toLocaleString()} numbers available</p> : null}
        {submitted && !pricesQuery.isFetching && pricesQuery.error ? <button className="inline-flex items-center gap-1 text-sm font-medium text-text underline underline-offset-4" onClick={() => pricesQuery.refetch()}><RefreshCw className="h-3.5 w-3.5" />Try again</button> : null}
        {submitted && !pricesQuery.isFetching && !pricesQuery.error && pricesQuery.data && !quote ? <p className="text-sm text-muted">No availability is listed for this selection right now.</p> : null}
      </div>
    </section>
  );
}
