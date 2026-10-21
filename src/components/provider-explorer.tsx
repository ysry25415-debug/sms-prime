"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronRight, LoaderCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Service = { code: string; name: string };
type Country = { id: string; name: string };
type Availability = { country: Country; price?: number; stock?: number };
type ProviderResponse<T> = { ok: true; data: T } | { ok: false; error: string };
type Activation = { activationId?: string | number; phoneNumber?: string; activationCost?: string | number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown) {
  const result = typeof value === "number" ? value : Number(value);
  return Number.isFinite(result) ? result : undefined;
}

async function getProvider<T>(action: string): Promise<T> {
  const response = await fetch(`/api/providers/smsbower?action=${action}`, { cache: "no-store" });
  const payload = (await response.json()) as ProviderResponse<T>;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.ok ? "Live provider data is unavailable right now." : payload.error);
  }
  return payload.data;
}

async function postProvider<T>(body: Record<string, string>): Promise<T> {
  const response = await fetch("/api/providers/smsbower", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = (await response.json()) as ProviderResponse<T>;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.ok ? "The number could not be reserved." : payload.error);
  }
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

function normaliseAvailability(data: unknown, countries: Country[]) {
  if (!isRecord(data)) return [] as Availability[];
  const names = new Map(countries.map((country) => [country.id, country]));

  return Object.entries(data)
    .flatMap(([countryId, value]) => {
      if (!isRecord(value)) return [];
      // SMSBower returns country -> partner -> { price, count }, not a direct country quote.
      // Keep the lowest live partner price and the total available stock for the country.
      const partners = Object.values(value)
        .flatMap((partner) => {
          if (!isRecord(partner)) return [];
          const price = asNumber(partner.price ?? partner.cost);
          const stock = asNumber(partner.count ?? partner.stock ?? partner.qty);
          return price !== undefined || stock !== undefined ? [{ price, stock }] : [];
        });
      const price = partners.reduce<number | undefined>((lowest, partner) => {
        if (partner.price === undefined) return lowest;
        return lowest === undefined ? partner.price : Math.min(lowest, partner.price);
      }, undefined);
      const stock = partners.reduce((total, partner) => total + (partner.stock ?? 0), 0);
      const country = names.get(String(countryId));
      return country && partners.length > 0 ? [{ country, price, stock }] : [];
    })
    .sort((left, right) => (right.stock ?? -1) - (left.stock ?? -1) || (left.price ?? Infinity) - (right.price ?? Infinity));
}

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Something interrupted the provider request. Try again.";
}

export function ProviderExplorer({ mode = "public" }: { mode?: "public" | "workspace" }) {
  const [search, setSearch] = useState("");
  const [service, setService] = useState<Service | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [activation, setActivation] = useState<Activation | null>(null);

  const servicesQuery = useQuery({
    queryKey: ["smsbower", "services"],
    queryFn: () => getProvider<{ services?: Service[] }>("getServicesList"),
    staleTime: 300_000,
    retry: false
  });
  const countriesQuery = useQuery({
    queryKey: ["smsbower", "countries"],
    queryFn: () => getProvider<unknown>("getCountries"),
    staleTime: 300_000,
    retry: false
  });

  const countries = useMemo(() => normaliseCountries(countriesQuery.data), [countriesQuery.data]);
  const matchingServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return (servicesQuery.data?.services ?? []).filter((item) => item.name.toLowerCase().includes(query)).slice(0, 8);
  }, [search, servicesQuery.data]);

  const availabilityQuery = useQuery({
    queryKey: ["smsbower", "top-countries", service?.code],
    queryFn: () => getProvider<unknown>(`getTopCountriesByService&service=${encodeURIComponent(service!.code)}`),
    enabled: Boolean(service),
    staleTime: 60_000,
    retry: false
  });
  const availability = useMemo(
    () => normaliseAvailability(availabilityQuery.data, countries),
    [availabilityQuery.data, countries]
  );
  const selectedAvailability = availability.find((item) => item.country.id === country?.id);

  const reserve = useMutation({
    mutationFn: () => postProvider<Activation>({
      action: "getNumberV2",
      service: service!.code,
      country: country!.id,
      ...(selectedAvailability?.price !== undefined ? { maxPrice: String(selectedAvailability.price) } : {})
    }),
    onSuccess: (data) => {
      setActivation(data);
      setConfirming(false);
    }
  });

  const chooseService = (item: Service) => {
    setService(item);
    setSearch(item.name);
    setCountry(null);
    setActivation(null);
    setShowResults(false);
  };

  const catalogError = servicesQuery.error ?? countriesQuery.error;
  const isCatalogLoading = servicesQuery.isLoading || countriesQuery.isLoading;

  return (
    <section className={mode === "public" ? "pb-16 pt-10 sm:pb-24 sm:pt-16" : ""} aria-label="Choose a verification number" data-ui>
      <div className={mode === "public" ? "mx-auto max-w-[1180px]" : ""}>
        {mode === "public" ? (
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-medium text-[#896B00]">SMS numbers</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-6xl">Choose a service. Get a number.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">Search the service you need, compare live country availability, then request one number when you are ready.</p>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-[#E7DFBE] bg-white">
          <div className="flex min-h-14 items-center gap-5 border-b border-[#EEE8D4] bg-[#FFFBEA] px-5 sm:px-7">
            <span className="h-14 border-b-2 border-[#C69A00] pt-[18px] text-sm font-semibold text-text">Numbers</span>
            <span className="text-sm text-muted">Live catalogue</span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0 p-5 sm:p-7">
              <div>
                <label htmlFor="service-search" className="text-sm font-semibold text-text">Select a service</label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    id="service-search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setShowResults(true);
                      if (service && event.target.value !== service.name) setService(null);
                    }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search WhatsApp, Telegram, Google…"
                    className="h-12 w-full rounded-xl border border-[#DDD5BA] bg-white pl-11 pr-4 text-[15px] text-text outline-none transition placeholder:text-[#8C8777] focus:border-[#B48C00] focus:ring-4 focus:ring-[#F7E9A9]/45"
                    autoComplete="off"
                  />
                  {showResults && search.trim() ? (
                    <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#DED7BF] bg-white p-1 shadow-[0_12px_28px_rgba(40,32,0,0.12)]">
                      {matchingServices.map((item) => (
                        <button key={item.code} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseService(item)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-text transition hover:bg-[#FFF9DD]">
                          <span>{item.name}</span><ChevronRight className="h-4 w-4 text-muted" />
                        </button>
                      ))}
                      {!isCatalogLoading && matchingServices.length === 0 ? <p className="px-3 py-4 text-sm text-muted">No matching service in the live catalogue.</p> : null}
                    </div>
                  ) : null}
                </div>
                {isCatalogLoading ? <p className="mt-3 flex items-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading services and countries…</p> : null}
                {catalogError ? <p className="mt-3 text-sm text-danger">{messageFor(catalogError)}</p> : null}
              </div>

              <div className="mt-9">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-text">Available countries</h2>
                    <p className="mt-1 text-sm text-muted">{service ? `Live options for ${service.name}.` : "Choose a service to see its live countries and prices."}</p>
                  </div>
                  {service && !availabilityQuery.isLoading ? <span className="text-sm tabular-nums text-muted">{availability.length} shown</span> : null}
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-[#E8E3D3]">
                  {availabilityQuery.isLoading ? <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Checking live availability…</div> : null}
                  {!service && !availabilityQuery.isLoading ? <div className="flex min-h-52 items-center px-5 text-sm leading-6 text-muted">The country list stays empty until you select a service. This keeps prices and stock tied to the choice you actually made.</div> : null}
                  {service && availabilityQuery.error ? <div className="min-h-52 px-5 py-8 text-sm text-danger">{messageFor(availabilityQuery.error)}</div> : null}
                  {service && !availabilityQuery.isLoading && !availabilityQuery.error && availability.length === 0 ? <div className="min-h-52 px-5 py-8 text-sm text-muted">No live country availability was returned for this service. Try another service or refresh later.</div> : null}
                  {availability.map((item) => {
                    const selected = item.country.id === country?.id;
                    return (
                      <button key={item.country.id} type="button" onClick={() => { setCountry(item.country); setActivation(null); }} className={`grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-[#F0ECDD] px-4 py-4 text-left last:border-b-0 transition sm:px-5 ${selected ? "bg-[#FFF8D8]" : "hover:bg-[#FFFCF0]"}`}>
                        <span className="min-w-0"><span className="block truncate text-sm font-medium text-text">{item.country.name}</span><span className="mt-0.5 block text-xs text-muted">{item.stock !== undefined ? `${item.stock.toLocaleString()} numbers available` : "Live availability"}</span></span>
                        <span className="text-right text-sm font-semibold tabular-nums text-text">{item.price !== undefined ? `from $${item.price.toFixed(2)}` : "—"}</span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? "border-[#A98100] bg-[#E5B928] text-[#1E1D19]" : "border-[#CFC7AB] text-transparent"}`}><Check className="h-3.5 w-3.5" /></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="border-t border-[#EEE8D4] bg-[#FFFDF5] p-5 sm:p-7 lg:border-l lg:border-t-0">
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-text">Your selection</h2>
              <div className="mt-6 space-y-5">
                <div><p className="text-xs font-medium text-muted">Service</p><p className="mt-1.5 text-sm font-medium text-text">{service?.name ?? "Not selected"}</p></div>
                <div><p className="text-xs font-medium text-muted">Country</p><p className="mt-1.5 text-sm font-medium text-text">{country?.name ?? "Not selected"}</p></div>
                <div className="border-t border-[#E8E1C9] pt-5"><p className="text-xs font-medium text-muted">Price</p><p className="mt-1 text-2xl font-semibold tracking-[-0.04em] tabular-nums text-text">{selectedAvailability?.price !== undefined ? `from $${selectedAvailability.price.toFixed(2)}` : "—"}</p><p className="mt-1 text-xs text-muted">{selectedAvailability?.stock !== undefined ? `${selectedAvailability.stock.toLocaleString()} numbers available now` : "Select a country to view live availability."}</p></div>
              </div>

              {activation?.phoneNumber ? <div className="mt-7 rounded-xl bg-[#FFF2B8] p-4"><p className="text-xs font-medium text-[#765B00]">Number reserved</p><p className="mt-1 break-all text-lg font-semibold tracking-[-0.03em] text-text">{activation.phoneNumber}</p><p className="mt-2 text-xs text-[#765B00]">Activation {activation.activationId ? `#${activation.activationId}` : "created"}. Follow it in Orders.</p></div> : null}

              {mode === "public" ? (
                <Link href={country ? "/login" : "/register"} className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-black">{country ? "Sign in to request number" : "Create account to continue"}<ArrowRight className="h-4 w-4" /></Link>
              ) : (
                <Button className="mt-7 w-full" disabled={!service || !country || reserve.isPending} onClick={() => setConfirming(true)}>{reserve.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Request number</Button>
              )}
              <p className="mt-3 text-xs leading-5 text-muted">A number is never requested until you confirm the selected service, country, and live price.</p>
            </aside>
          </div>
        </div>
      </div>

      {confirming && service && country ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1E1D19]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="reserve-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(30,29,25,0.24)]">
            <div className="flex items-start justify-between gap-5"><div><p className="text-sm font-medium text-[#896B00]">Confirm request</p><h2 id="reserve-title" className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-text">Reserve this number?</h2></div><button type="button" className="rounded-lg p-2 text-muted transition hover:bg-[#F6F3E7] hover:text-text" onClick={() => setConfirming(false)} aria-label="Close confirmation"><X className="h-5 w-5" /></button></div>
            <p className="mt-4 text-sm leading-6 text-muted">You are about to create a paid activation from your wallet for <span className="font-medium text-text">{service.name}</span> in <span className="font-medium text-text">{country.name}</span>{selectedAvailability?.price !== undefined ? ` at approximately $${selectedAvailability.price.toFixed(2)}` : ""}.</p>
            {reserve.error ? <p className="mt-4 text-sm text-danger">{messageFor(reserve.error)}</p> : null}
            <div className="mt-7 flex justify-end gap-3"><Button variant="secondary" onClick={() => setConfirming(false)}>Go back</Button><Button disabled={reserve.isPending} onClick={() => reserve.mutate()}>{reserve.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Confirm request</Button></div>
          </div>
        </div>
      ) : null}
    </section>
  );
}


