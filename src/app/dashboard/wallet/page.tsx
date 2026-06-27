export default function WalletPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm text-muted">Wallet</p>
        <h1 className="mt-1 text-3xl font-semibold text-text">Your wallet starts at a clean zero balance.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          Deposits will appear here after a payment gateway is connected. Until then, SMSPrime will not show artificial balances or fake invoices.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/8 bg-slate-950/35 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Available balance</p>
          <div className="mt-3 text-4xl font-semibold text-text">$0.00</div>
          <p className="mt-3 text-sm text-muted">No successful deposits yet.</p>
        </div>
        <div className="rounded-[28px] border border-white/8 bg-slate-950/35 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Payment gateway</p>
          <div className="mt-3 text-2xl font-semibold text-amber-300">Not connected</div>
          <p className="mt-3 text-sm text-muted">Connect Stripe, Paymob, or another provider before accepting money.</p>
        </div>
        <div className="rounded-[28px] border border-white/8 bg-slate-950/35 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Invoices</p>
          <div className="mt-3 text-2xl font-semibold text-text">0</div>
          <p className="mt-3 text-sm text-muted">Invoices will be generated from real transactions only.</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
        <h2 className="text-xl font-semibold text-text">No deposit history yet.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Once the payment gateway webhook is added, successful deposits can update wallet balance automatically.
        </p>
      </div>
    </div>
  );
}
