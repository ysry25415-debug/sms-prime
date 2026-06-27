import { ActivityFeed } from "@/components/activity-feed";
import { LiveBalanceCard } from "@/components/live-balance-card";
import { ServiceTable } from "@/components/service-table";
import { StatsGrid } from "@/components/stats-grid";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Manage real SMS operations from one clean workspace.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          The dashboard now starts from a truthful zero state. Wallet balance, orders, and messages will only change when real provider or payment data is connected.
        </p>
      </section>
      <StatsGrid />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <LiveBalanceCard />
        <div className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Production checklist</p>
          <h2 className="mt-2 text-2xl font-semibold text-text">No demo data is shown as customer activity.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Add SMSBower and payment gateway credentials in Vercel, then real services, deposits, orders, and codes can flow into these cards.
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
