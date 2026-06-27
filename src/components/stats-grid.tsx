import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { stats } from "@/data/mock";
import { cn } from "@/lib/utils";

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="group relative overflow-hidden space-y-2 border-white/10 bg-slate-950/35">
          <div
            className={cn(
              "absolute right-4 top-4 h-12 w-12 rounded-full blur-2xl transition group-hover:scale-125",
              stat.tone === "warning" ? "bg-amber-400/20" : "bg-blue-400/15"
            )}
          />
          <CardDescription>{stat.label}</CardDescription>
          <CardTitle className="text-3xl">{stat.value}</CardTitle>
          <div className={cn("text-sm", stat.tone === "warning" ? "text-amber-300" : "text-muted")}>{stat.delta}</div>
        </Card>
      ))}
    </div>
  );
}
