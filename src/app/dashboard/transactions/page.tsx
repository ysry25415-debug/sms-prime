export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Transactions</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">Deposits, refunds, and activation charges will appear here once they are recorded.</p>
      </section>

      <div className="rounded-xl border border-dashed border-border bg-[#FAF9F4] p-10 text-center">
        <h2 className="text-xl font-semibold text-text">No transactions yet.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Connect the payment gateway webhook and database writes to populate this table with real financial records.
        </p>
      </div>
    </div>
  );
}
