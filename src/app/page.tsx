import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <Hero />
      </main>
      <footer className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-[#E7DFBE] px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>© {new Date().getFullYear()} SMSPrime</span>
        <span>Live availability. Clear selections. No surprises.</span>
      </footer>
    </div>
  );
}


