import Link from "next/link";
import { AuthScreen } from "@/components/auth-screen";
import { Badge } from "@/components/ui/badge";

const plans = [
  { name: "Starter", price: "$19", details: "Basic access for individual operators." },
  { name: "Pro", price: "$49", details: "Best for active teams and daily usage." },
  { name: "Enterprise", price: "Custom", details: "Advanced permissions and support." }
];

export default function SubscriptionPage() {
  return (
    <AuthScreen
      title="Choose a subscription"
      description="Select a plan that matches your usage, team size, and platform access requirements."
      footer={
        <p className="text-sm text-muted">
          Need help? <Link href="/support" className="text-primary">Open support</Link>
        </p>
      }
    >
      <div className="space-y-3">
        {plans.map((plan, index) => (
          <div key={plan.name} className="rounded-lg border border-border bg-[#F7F5ED] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-text">{plan.name}</div>
                <div className="mt-1 text-xs text-muted">{plan.details}</div>
              </div>
              <Badge variant={index === 1 ? "success" : "outline"}>{plan.price}</Badge>
            </div>
          </div>
        ))}
        <p className="pt-2 text-sm leading-6 text-muted">Plan checkout will appear here when billing is connected.</p>
      </div>
    </AuthScreen>
  );
}
