import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProviderExplorer } from "@/components/provider-explorer";

export function Hero() {
  return (
    <>
      <section id="numbers" className="grid gap-10 border-b border-border pb-12 pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:pb-20 lg:pt-20">
        <div className="max-w-xl">
          <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-text sm:text-6xl lg:text-7xl">Verification numbers, without the noise.</h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted">Select a service and country, check live availability, and keep every activation in one focused workspace.</p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-text">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#9A6700]" />Live provider availability</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#9A6700]" />One clear activation flow</span>
          </div>
          <Link href="/register" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-text underline decoration-[#E5B928] decoration-2 underline-offset-4 transition hover:decoration-text">Open your workspace <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ProviderExplorer compact />
      </section>
      <section id="process" className="grid gap-8 py-12 lg:grid-cols-[0.7fr_1.3fr] lg:py-20">
        <div><h2 className="text-2xl font-semibold tracking-[-0.035em] text-text">A direct route from search to code.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-muted">The workspace is designed around the real activation lifecycle, not decorative dashboards.</p></div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {[ ["Find a service", "Browse the live catalog and choose a country."], ["Reserve when ready", "Review price and availability before any purchase."], ["Follow the activation", "Track the incoming code and finish or cancel clearly."] ].map(([title, description]) => <li key={title} className="border-t-2 border-[#E5B928] pt-4"><h3 className="text-base font-semibold text-text">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{description}</p></li>)}
        </ol>
      </section>
    </>
  );
}
