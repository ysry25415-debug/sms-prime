import { ActivityFeed } from "@/components/activity-feed";
import { LiveBalanceCard } from "@/components/live-balance-card";
import { ServiceTable } from "@/components/service-table";
import { StatsGrid } from "@/components/stats-grid";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Your SMSPrime dashboard is ready.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          This layout mirrors the fast, familiar SMS workflow users expect while keeping the visual identity fully original.
        </p>
      </section>
      <StatsGrid />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <LiveBalanceCard />
        <div className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Workflow note</p>
          <h2 className="mt-2 text-2xl font-semibold text-text">Dashboard is protected and wired to Supabase sessions.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            The live balance card now talks to the internal provider route, so once the SMSBower key is completed the dashboard will show real data without changing the UI.
          </p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <ServiceTable />
        <ActivityFeed />
      </div>
    </div>
  );
}
