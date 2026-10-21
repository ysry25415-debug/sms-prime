export default function ApiKeysPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <header className="border-b border-border pb-5"><h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">API keys</h1><p className="mt-1 text-sm text-muted">Create scoped credentials for your own integrations.</p></header>
      <section className="rounded-xl border border-dashed border-border bg-[#FAF9F4] p-8"><h2 className="text-base font-semibold text-text">No API keys yet</h2><p className="mt-2 text-sm leading-6 text-muted">Keys will be listed here only after a secure server-side creation flow is enabled.</p></section>
    </div>
  );
}
