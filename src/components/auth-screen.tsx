import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AuthScreen({
  title,
  description,
  children,
  footer
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-hero-grid px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Secure account workflow
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted">{description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-muted">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Premium interface
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ArrowRight className="h-4 w-4 text-success" />
              Fast onboarding
            </div>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md border-white/10 bg-slate-950/55 p-6 shadow-glow">
          {children}
          {footer ? <div className="mt-6 border-t border-white/8 pt-4">{footer}</div> : null}
        </Card>
      </div>
    </div>
  );
}
