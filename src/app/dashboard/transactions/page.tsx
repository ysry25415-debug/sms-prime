export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm text-muted">Transactions</p>
        <h1 className="mt-1 text-3xl font-semibold text-text">Searchable transaction history.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          This page is ready for real wallet events. It intentionally starts empty until deposits, refunds, or order charges are saved.
        </p>
      </section>

      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
        <h2 className="text-xl font-semibold text-text">No transactions yet.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Connect the payment gateway webhook and database writes to populate this table with real financial records.
        </p>
      </div>
    </div>
  );
}
