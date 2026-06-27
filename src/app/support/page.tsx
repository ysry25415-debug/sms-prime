import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-hero-grid px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="space-y-4 border-white/10 bg-slate-950/55 p-8 shadow-glow">
          <p className="text-sm text-muted">Support</p>
          <h1 className="text-4xl font-semibold text-text">Need help with your SMSPrime account?</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted">
            Use this space for support tickets, live chat entry points, documentation links, and incident updates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Open ticket</Button>
            <Button variant="secondary">View docs</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
