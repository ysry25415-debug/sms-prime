import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { StatsGrid } from "@/components/stats-grid";
import { ServiceTable } from "@/components/service-table";
import { ActivityFeed } from "@/components/activity-feed";
import { LiveBalanceCard } from "@/components/live-balance-card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-6 lg:px-8 lg:py-8">
        <Hero />
        <StatsGrid />
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <LiveBalanceCard />
          <div className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm text-muted">Architecture</p>
            <h2 className="mt-2 text-2xl font-semibold text-text">Built for real provider and payment data, not fake activity.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Authentication, dashboard protection, SMSBower routing, webhook handling, and a Supabase-ready backend are in place. The dashboard stays at a truthful zero state until production credentials are added.
            </p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <ServiceTable />
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
