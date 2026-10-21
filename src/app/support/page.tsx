import { Card } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F7F5ED] px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="space-y-4 p-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text">Need help with your SMSPrime account?</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted">
            Support tools are not connected yet. Add the real support destination before exposing ticket or chat controls here.
          </p>
        </Card>
      </div>
    </div>
  );
}
