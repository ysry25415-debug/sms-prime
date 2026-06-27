import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orders } from "@/data/mock";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted">Orders</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Track active and completed number orders.</h1>
          </div>
          <div className="flex gap-3">
            <Input className="w-full lg:w-72" placeholder="Search orders..." />
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>
      </section>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted">
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
                  <tr key={order.id} className="border-t border-white/8">
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
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10">
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
