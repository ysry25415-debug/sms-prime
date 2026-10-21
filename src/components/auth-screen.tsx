import { ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#F7F5ED] px-5 py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <section>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-text"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E5B928]">SP</span> SMSPrime</div>
          <h1 className="mt-10 max-w-[11ch] text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-text sm:text-6xl">{title}</h1>
          <p className="max-w-xl text-base leading-7 text-muted">{description}</p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-text"><ArrowRight className="h-4 w-4 text-[#9A6700]" />Your workspace keeps activations and account controls in one place.</p>
        </section>
        <Card className="mx-auto w-full max-w-md p-6">
          {children}
          {footer ? <div className="mt-6 border-t border-border pt-4">{footer}</div> : null}
        </Card>
      </div>
    </div>
  );
}
