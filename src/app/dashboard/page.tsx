import { ProviderExplorer } from "@/components/provider-explorer";

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Get a number</h1>
          <p className="mt-1 text-sm text-muted">Choose a service, compare live country availability, and confirm when you are ready to reserve.</p>
        </div>
        <p className="text-xs text-muted">Live data refreshes when you select a service</p>
      </header>
      <ProviderExplorer mode="workspace" />
    </div>
  );
}


