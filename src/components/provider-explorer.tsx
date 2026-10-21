"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronUp, LoaderCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Service = { code: string; name: string };
type Country = { id: string; name: string };
type ProviderOffer = { id: string; price?: number; stock?: number };
type Availability = { key: string; country: Country; price?: number; stock?: number };
type ProviderResponse<T> = { ok: true; data: T } | { ok: false; error: string };
type Activation = { activationId?: string | number; phoneNumber?: string; activationCost?: string | number };

const countryFlags: Record<string, string> = {
  usa: "🇺🇸", unitedstates: "🇺🇸", canada: "🇨🇦", brazil: "🇧🇷", mexico: "🇲🇽", colombia: "🇨🇴", argentina: "🇦🇷",
  unitedkingdom: "🇬🇧", uk: "🇬🇧", germany: "🇩🇪", france: "🇫🇷", italy: "🇮🇹", spain: "🇪🇸", poland: "🇵🇱",
  turkey: "🇹🇷", russia: "🇷🇺", ukraine: "🇺🇦", kazakhstan: "🇰🇿", egypt: "🇪🇬", india: "🇮🇳", indonesia: "🇮🇩",
  vietnam: "🇻🇳", thailand: "🇹🇭", philippines: "🇵🇭", china: "🇨🇳", japan: "🇯🇵", southkorea: "🇰🇷", korea: "🇰🇷",
  australia: "🇦🇺", uae: "🇦🇪", unitedarabemirates: "🇦🇪", saudiarabia: "🇸🇦", nigeria: "🇳🇬", southafrica: "🇿🇦"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown) {
  const result = typeof value === "number" ? value : Number(value);
  return Number.isFinite(result) ? result : undefined;
}

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function displayCountry(key: string, countries: Country[]) {
  const direct = countries.find((country) => country.id === key);
  if (direct) return direct;
  const known = countries.find((country) => compact(country.name) === compact(key));
  if (known) return { ...known, id: key };
  const aliases: Record<string, string> = { usa: "United States", uk: "United Kingdom", uae: "United Arab Emirates", korea: "South Korea" };
  return { id: key, name: aliases[compact(key)] ?? key.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) };
}

function flagFor(country: Country) {
  return countryFlags[compact(country.name)] ?? countryFlags[compact(country.id)] ?? "·";
}

function formatMoney(value?: number) {
  return value === undefined ? "—" : `$${value.toFixed(2)}`;
}

function formatStock(value?: number) {
  return value === undefined ? "Live stock" : `${value.toLocaleString()} pcs`;
}


async function getProvider<T>(action: string): Promise<T> {
  const response = await fetch(`/api/providers/smsbower?action=${action}`, { cache: "no-store" });
  const payload = (await response.json()) as ProviderResponse<T>;
  if (!response.ok || !payload.ok) throw new Error(payload.ok ? "Live provider data is unavailable right now." : payload.error);
  return payload.data;
}

async function postProvider<T>(body: Record<string, string>): Promise<T> {
  const response = await fetch("/api/providers/smsbower", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const payload = (await response.json()) as ProviderResponse<T>;
  if (!response.ok || !payload.ok) throw new Error(payload.ok ? "The number could not be reserved." : payload.error);
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

function normaliseAvailability(data: unknown, service: Service, countries: Country[]) {
  if (!isRecord(data)) return [] as Availability[];
  return Object.entries(data).flatMap(([key, countryData]) => {
    if (!isRecord(countryData)) return [];
    const quote = countryData[service.code];
    if (!isRecord(quote)) return [];
    const price = asNumber(quote.cost ?? quote.price);
    const stock = asNumber(quote.count ?? quote.stock ?? quote.qty);
    return price !== undefined || stock !== undefined ? [{ key, country: displayCountry(key, countries), price, stock }] : [];
  }).sort((left, right) => (right.stock ?? -1) - (left.stock ?? -1) || (left.price ?? Infinity) - (right.price ?? Infinity));
}

function normaliseOffers(data: unknown, service: Service, countryKey: string) {
  if (!isRecord(data)) return [] as ProviderOffer[];
  const countryData = data[countryKey];
  if (!isRecord(countryData)) return [];
  const serviceData = countryData[service.code];
  if (!isRecord(serviceData)) return [];
  return Object.entries(serviceData).flatMap(([id, quote]) => {
    if (!isRecord(quote)) return [];
    const price = asNumber(quote.price ?? quote.cost);
    const stock = asNumber(quote.count ?? quote.stock ?? quote.qty);
    const providerId = quote.provider_id ?? quote.providerId ?? id;
    return price !== undefined || stock !== undefined ? [{ id: String(providerId), price, stock }] : [];
  }).sort((left, right) => (left.price ?? Infinity) - (right.price ?? Infinity) || (right.stock ?? -1) - (left.stock ?? -1));
}

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Something interrupted the provider request. Try again.";
}

export function ProviderExplorer({ mode = "public" }: { mode?: "public" | "workspace" }) {
  const [search, setSearch] = useState("");
  const [service, setService] = useState<Service | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Availability | null>(null);
  const [openCountry, setOpenCountry] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [activation, setActivation] = useState<Activation | null>(null);

  const servicesQuery = useQuery({ queryKey: ["smsbower", "services"], queryFn: () => getProvider<{ services?: Service[] }>("getServicesList"), staleTime: 300_000, retry: false });
  const countriesQuery = useQuery({ queryKey: ["smsbower", "countries"], queryFn: () => getProvider<unknown>("getCountries"), staleTime: 300_000, retry: false });
  const countries = useMemo(() => normaliseCountries(countriesQuery.data), [countriesQuery.data]);
  const services = servicesQuery.data?.services ?? [];
  const visibleServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    const candidates = query ? services.filter((item) => item.name.toLowerCase().includes(query)) : services;
    return candidates.slice(0, 15);
  }, [search, services]);

  const availabilityQuery = useQuery({
    queryKey: ["smsbower", "prices", service?.code],
    queryFn: () => getProvider<unknown>(`getPrices&service=${encodeURIComponent(service!.code)}`),
    enabled: Boolean(service), staleTime: 60_000, retry: false
  });
  const availability = useMemo(() => service ? normaliseAvailability(availabilityQuery.data, service, countries) : [], [availabilityQuery.data, countries, service]);

  const offersQuery = useQuery({
    queryKey: ["smsbower", "price-options", service?.code, openCountry],
    queryFn: () => getProvider<unknown>(`getPricesV3&service=${encodeURIComponent(service!.code)}&country=${encodeURIComponent(openCountry!)}`),
    enabled: Boolean(service && openCountry), staleTime: 60_000, retry: false
  });
  const offers = useMemo(() => service && openCountry ? normaliseOffers(offersQuery.data, service, openCountry) : [], [offersQuery.data, openCountry, service]);
  const selectedOffer = offers.find((offer) => offer.id === selectedProvider);

  const reserve = useMutation({
    mutationFn: () => postProvider<Activation>({
      action: "getNumberV2", service: service!.code, country: selectedCountry!.key,
      ...((selectedOffer?.price ?? selectedCountry?.price) !== undefined ? { maxPrice: String(selectedOffer?.price ?? selectedCountry?.price) } : {}),
      ...(selectedProvider ? { providerIds: selectedProvider } : {})
    }),
    onSuccess: (data) => { setActivation(data); setConfirming(false); }
  });
  const cancelActivation = useMutation({
    mutationFn: () => postProvider<{ result?: string }>({ action: "setStatus", id: String(activation!.activationId), status: "8" }),
    onSuccess: () => setActivation(null)
  });

  const chooseService = (item: Service) => {
    setService(item); setSearch(item.name); setSelectedCountry(null); setSelectedProvider(null); setOpenCountry(null); setActivation(null);
  };
  const toggleCountry = (item: Availability) => {
    const next = openCountry === item.key ? null : item.key;
    setOpenCountry(next); setSelectedCountry(item); setSelectedProvider(null); setActivation(null);
  };
  const maxStock = offers.reduce((highest, offer) => Math.max(highest, offer.stock ?? 0), 0);
  const bestPrice = offers[0]?.price;

  return (
    <section className={mode === "public" ? "py-10 sm:py-14" : ""} aria-label="SMS number catalogue" data-ui>
      <div className={mode === "public" ? "mx-auto max-w-[1280px]" : ""}>
        {mode === "public" ? <header className="mb-7 max-w-2xl"><h1 className="text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl">Choose a service and country</h1><p className="mt-3 text-base leading-7 text-muted">Live services, country stock, and supplier prices in one place.</p></header> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,570px)_minmax(380px,1fr)]">
          <div className="rounded-2xl bg-[#FFF7D6] p-4 sm:p-5">
            <div className="flex gap-2 rounded-xl bg-[#F0E9CD] p-1.5"><span className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#E5B928] text-sm font-semibold text-[#1E1D19]">Numbers</span><span className="flex h-10 flex-1 items-center justify-center text-sm text-muted">E-mails</span></div>
            <div className="mt-5 rounded-2xl bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#1E1D19] text-sm font-semibold text-white">1</span><div><h2 className="text-xl font-semibold tracking-[-0.03em] text-text">Select service</h2><p className="mt-0.5 text-sm text-muted">Choose the account you want to verify.</p></div></div>
              <label className="relative mt-5 block"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Select service" className="h-12 w-full rounded-xl border border-[#E5DEC4] bg-[#FFFDF5] pl-11 pr-4 text-[15px] text-text outline-none focus:border-[#B48C00] focus:ring-4 focus:ring-[#F7E9A9]/50" /></label>
              {servicesQuery.isLoading ? <p className="mt-5 flex items-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading services…</p> : null}
              {servicesQuery.error ? <p className="mt-5 text-sm text-danger">{messageFor(servicesQuery.error)}</p> : null}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{visibleServices.map((item) => { const active = item.code === service?.code; return <button key={item.code} type="button" onClick={() => chooseService(item)} className={`min-h-12 rounded-xl px-3 text-left text-sm font-medium transition ${active ? "bg-[#1E1D19] text-white" : "bg-[#FFF9E7] text-text hover:bg-[#F9E9A9]"}`}>{item.name}</button>; })}</div>
              {!servicesQuery.isLoading && visibleServices.length === 0 ? <p className="mt-5 text-sm text-muted">No matching service in the live catalogue.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-[#1E1D19] p-6 text-white sm:p-8">
            {service ? <><div><p className="text-sm text-[#EFD46D]">Selected service</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">{service.name}</h2><p className="mt-2 text-sm leading-6 text-white/65">Choose a country from the list to compare the available supplier offers.</p></div><div className="mt-10 border-t border-white/15 pt-6">{/* taste-skill-ignore: selection summary separator */}<p className="text-sm text-white/60">Your country</p><p className="mt-2 text-xl font-semibold">{selectedCountry?.country.name ?? "Not selected"}</p><p className="mt-1 text-sm text-white/60">{selectedCountry ? `${formatStock(selectedOffer?.stock ?? selectedCountry.stock)} · ${selectedOffer ? formatMoney(selectedOffer.price) : `from ${formatMoney(selectedCountry.price)}`}` : "Select a country to continue."}</p></div></> : <><p className="text-sm text-[#EFD46D]">SMSPrime catalogue</p><h2 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.045em]">Numbers when you need them.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-white/70">Start with a service. The country list will then show live stock and the lowest available price.</p></>}
            {activation?.phoneNumber ? <div className="mt-8 rounded-xl bg-[#FFF2B8] p-4 text-[#1E1D19]"><p className="text-xs font-medium text-[#765B00]">Number reserved</p><p className="mt-1 break-all text-lg font-semibold">{activation.phoneNumber}</p><p className="mt-2 text-xs text-[#765B00]">Activation {activation.activationId ? `#${activation.activationId}` : "created"}.</p>{cancelActivation.error ? <p className="mt-3 text-xs text-danger">{messageFor(cancelActivation.error)}</p> : null}<Button variant="secondary" size="sm" className="mt-4 w-full" disabled={!activation.activationId || cancelActivation.isPending} onClick={() => cancelActivation.mutate()}>{cancelActivation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Cancel number</Button></div> : null}
            {mode === "public" ? <Link href="/login" className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#E5B928] px-4 text-sm font-semibold text-[#1E1D19] transition hover:bg-[#F1D66B]">Sign in to get a number</Link> : <Button className="mt-8 w-full bg-[#E5B928] text-[#1E1D19] hover:bg-[#F1D66B]" disabled={!selectedCountry || reserve.isPending} onClick={() => setConfirming(true)}>{reserve.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Get number</Button>}
          </aside>
        </div>

        <section className="mt-7 rounded-2xl border border-[#EAE3CA] bg-white p-5 sm:p-7"><div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold tracking-[-0.035em] text-text">Available countries</h2><p className="mt-1 text-sm text-muted">{service ? `Live availability for ${service.name}.` : "Select a service to display countries and prices."}</p></div>{service && !availabilityQuery.isLoading ? <span className="text-sm tabular-nums text-muted">{availability.length} countries</span> : null}</div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">{availabilityQuery.isLoading ? <div className="col-span-full flex min-h-40 items-center justify-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading country prices…</div> : null}{availabilityQuery.error ? <p className="col-span-full py-8 text-sm text-danger">{messageFor(availabilityQuery.error)}</p> : null}{!service && !availabilityQuery.isLoading ? <p className="col-span-full py-8 text-sm text-muted">Country results will appear here after you choose a service.</p> : null}{service && !availabilityQuery.isLoading && !availabilityQuery.error && availability.length === 0 ? <p className="col-span-full py-8 text-sm text-muted">No country prices are available for this service right now.</p> : null}
            {availability.map((item) => { const expanded = openCountry === item.key; return <article key={item.key} className={`overflow-hidden rounded-xl border ${expanded ? "border-[#D0A600] bg-[#FFF9E6]" : "border-[#ECE7D7] bg-white"}`}><div className="flex items-center gap-3 p-4 sm:p-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#F5F0DE] text-3xl" role="img" aria-label={`${item.country.name} flag`}>{flagFor(item.country)}</span><div className="min-w-0 flex-1"><h3 className="truncate text-lg font-semibold tracking-[-0.02em] text-text">{item.country.name}</h3><p className="mt-1 text-sm text-muted"><span className="font-medium text-text">{formatStock(item.stock)}</span> from {formatMoney(item.price)}</p></div><div className="flex shrink-0 flex-col gap-2"><Button size="sm" onClick={() => toggleCountry(item)}>{expanded ? "Hide" : "Select"}{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</Button><button type="button" onClick={() => { setSelectedCountry(item); setOpenCountry(item.key); setSelectedProvider(null); }} className="text-xs font-semibold text-[#876800] underline underline-offset-4">Buy</button></div></div>
              {expanded ? <div className="border-t border-[#EAE1C3] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">{/* taste-skill-ignore: supplier price table boundary */}<div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-1 pb-2 text-xs text-muted"><span>Supplier option</span><span className="text-right">Stock</span><span className="w-[106px] text-right">Price</span></div>{offersQuery.isLoading ? <div className="flex h-20 items-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading supplier prices…</div> : null}{offersQuery.error ? <p className="py-3 text-sm text-danger">{messageFor(offersQuery.error)}</p> : null}{!offersQuery.isLoading && !offersQuery.error && offers.length === 0 ? <p className="py-3 text-sm text-muted">No individual supplier prices were returned. You can still request at the displayed country price.</p> : null}{offers.map((offer) => { const label = offer.price === bestPrice ? "Best price" : offer.stock === maxStock ? "Most stock" : "Available"; const selected = offer.id === selectedProvider; return <button key={offer.id} type="button" onClick={() => { setSelectedCountry(item); setSelectedProvider(offer.id); }} className={`grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-lg px-3 py-3 text-left transition ${selected ? "bg-[#F8E59A]" : "hover:bg-[#FFF4C9]"}`}><span><span className="block text-sm font-medium text-text">{label}</span><span className="text-xs text-muted">Provider #{offer.id}</span></span><span className="text-right text-sm tabular-nums text-text">{formatStock(offer.stock)}</span><span className="w-[106px] rounded-lg bg-[#1E1D19] px-3 py-2 text-right text-sm font-semibold tabular-nums text-white">{formatMoney(offer.price)}{selected ? <Check className="ml-2 inline h-3.5 w-3.5 text-[#E5B928]" /> : null}</span></button>; })}</div> : null}</article>; })}</div>
        </section>
      </div>

      {confirming && service && selectedCountry ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#1E1D19]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="reserve-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(30,29,25,0.24)]">{/* taste-skill-ignore: confirmation dialog elevation */}<div className="flex items-start justify-between gap-5"><div><p className="text-sm font-medium text-[#896B00]">Confirm request</p><h2 id="reserve-title" className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-text">Get this number?</h2></div><button type="button" className="rounded-lg p-2 text-muted hover:bg-[#F6F3E7]" onClick={() => setConfirming(false)} aria-label="Close confirmation"><X className="h-5 w-5" /></button></div><p className="mt-4 text-sm leading-6 text-muted">You are about to create a paid activation for <span className="font-medium text-text">{service.name}</span> in <span className="font-medium text-text">{selectedCountry.country.name}</span>{(selectedOffer?.price ?? selectedCountry.price) !== undefined ? ` at ${formatMoney(selectedOffer?.price ?? selectedCountry.price)}` : ""}.</p>{reserve.error ? <p className="mt-4 text-sm text-danger">{messageFor(reserve.error)}</p> : null}<div className="mt-7 flex justify-end gap-3"><Button variant="secondary" onClick={() => setConfirming(false)}>Go back</Button><Button disabled={reserve.isPending} onClick={() => reserve.mutate()}>{reserve.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Confirm</Button></div></div></div> : null}
    </section>
  );
}


