import { LiveBalanceCard } from "@/components/live-balance-card";
import { ProviderExplorer } from "@/components/provider-explorer";
import { ServiceTable } from "@/components/service-table";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Numbers</h1>
          <p className="mt-1 text-sm text-muted">Select a service, compare live availability, then begin an activation when your wallet is ready.</p>
        </div>
        <p className="text-xs text-muted">Provider data refreshes on request</p>
      </header>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ProviderExplorer />
        <LiveBalanceCard />
      </div>
      <ServiceTable />
    </div>
  );
}
