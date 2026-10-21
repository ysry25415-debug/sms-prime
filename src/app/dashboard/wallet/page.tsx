export default function WalletPage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Wallet</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">Your wallet starts at a real zero and changes only when a confirmed payment arrives.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Available balance</p>
          <div className="mt-3 text-3xl font-semibold text-text num">$0.00</div>
          <p className="mt-3 text-sm text-muted">No successful deposits yet.</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Payment gateway</p>
          <div className="mt-3 text-xl font-semibold text-[#9A6700]">Not connected</div>
          <p className="mt-3 text-sm text-muted">Connect Stripe, Paymob, or another provider before accepting money.</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Invoices</p>
          <div className="mt-3 text-2xl font-semibold text-text">0</div>
          <p className="mt-3 text-sm text-muted">Invoices will be generated from real transactions only.</p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-[#FAF9F4] p-8 text-center">
        <h2 className="text-xl font-semibold text-text">No deposit history yet.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Once the payment gateway webhook is added, successful deposits can update wallet balance automatically.
        </p>
      </div>
    </div>
  );
}
