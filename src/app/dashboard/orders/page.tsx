import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { orders } from "@/data/mock";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-border pb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Activations</h1>
            <p className="mt-1 text-sm text-muted">Track reserved numbers and their current verification state.</p>
          </div>
          <p className="text-sm text-muted">Orders are recorded from completed provider reservations.</p>
        </div>
      </section>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full text-left">
            <thead className="text-xs text-muted">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">Number</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Expires</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-5 py-4 text-sm font-medium text-text">{order.id}</td>
                    <td className="px-5 py-4 text-sm text-text">{order.service}</td>
                    <td className="px-5 py-4 text-sm text-muted">{order.country}</td>
                    <td className="px-5 py-4 text-sm text-text">{order.number}</td>
                    <td className="px-5 py-4 text-sm text-muted">{order.provider}</td>
                    <td className="px-5 py-4 text-sm text-text">{order.price}</td>
                    <td className="px-5 py-4 text-sm text-text">{order.expires}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          order.status === "Active"
                            ? "success"
                            : order.status === "Pending"
                              ? "warning"
                              : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <div className="rounded-xl border border-dashed border-border bg-[#FAF9F4] p-10">
                <h2 className="text-xl font-semibold text-text">No real orders yet.</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
                  Orders will appear here only after a successful provider purchase. We removed the fake Telegram and WhatsApp orders so the dashboard reflects the real account state.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
