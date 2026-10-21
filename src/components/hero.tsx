import { ProviderExplorer } from "@/components/provider-explorer";

export function Hero() {
  return (
    <>
      <ProviderExplorer />
      <section id="how-it-works" className="border-t border-[#E7DFBE] py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-5">
          {[
            ["Find the service", "Search the name your account needs to verify."],
            ["Choose an available country", "See the provider’s live price and stock before continuing."],
            ["Confirm the request", "Reserve only after the service, country, and price are clear."]
          ].map(([title, description]) => (
            <div key={title} className="max-w-xs">
              <h2 className="text-base font-semibold tracking-[-0.02em] text-text">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


