import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { activity, messages, providers } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

export function ActivityFeed() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <CardTitle>Recent activity</CardTitle>
        <div className="space-y-3">
          {activity.map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="text-sm text-text">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <CardTitle>API status</CardTitle>
        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.name} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-text">{provider.name}</div>
                  <div className="text-xs text-muted">Uptime {provider.uptime}</div>
                </div>
                <Badge variant={provider.status === "Operational" ? "success" : "warning"}>{provider.status}</Badge>
              </div>
              <div className="mt-3 text-xs text-muted">Latency {provider.latency}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <CardDescription>Latest SMS</CardDescription>
          <div className="mt-3 space-y-3">
            {messages.map((message) => (
              <div key={message.code} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-text">{message.service}</div>
                  <Badge variant={message.status === "Delivered" ? "success" : "warning"}>{message.status}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted">
                  {message.number} | {message.country}
                </div>
                <div className="mt-2 text-lg font-semibold text-emerald-300">{message.code}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
