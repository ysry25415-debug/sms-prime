import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { stats } from "@/data/mock";

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="space-y-2">
          <CardDescription>{stat.label}</CardDescription>
          <CardTitle className="text-2xl num">{stat.value}</CardTitle>
          <div className={stat.tone === "warning" ? "text-sm text-[#714A00]" : "text-sm text-muted"}>{stat.delta}</div>
        </Card>
      ))}
    </div>
  );
}
