import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { services } from "@/data/mock";

export function ServiceTable() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-white/8 p-5">
        <CardTitle>Popular services</CardTitle>
        <CardDescription>Familiar SMS marketplace style, redesigned with SMSPrime branding.</CardDescription>
      </div>
      <div className="overflow-x-auto">
        {services.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={`${service.name}-${service.country}`} className="border-t border-white/8">
                  <td className="px-5 py-4 text-sm font-medium text-text">{service.name}</td>
                  <td className="px-5 py-4 text-sm text-muted">{service.country}</td>
                  <td className="px-5 py-4 text-sm text-text">{service.price}</td>
                  <td className="px-5 py-4 text-sm text-text">{service.stock}</td>
                  <td className="px-5 py-4">
                    <Badge variant={service.status === "Hot" ? "success" : service.status === "Limited" ? "warning" : "default"}>
                      {service.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="secondary" size="sm">
                      Buy
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6">
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/30 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">SP</div>
              <h3 className="mt-4 text-lg font-semibold text-text">Live services are waiting for provider setup.</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
                Add SMSBOWER_API_KEY in Vercel, then this table can show real service, country, price, and stock data from the provider.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
