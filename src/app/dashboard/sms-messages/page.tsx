"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { messages } from "@/data/mock";

export default function SmsMessagesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-6">
      <section className="border-b border-border pb-5">
        <div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.035em] text-text">Messages</h1>
            <p className="mt-1 text-sm text-muted">Incoming verification messages remain linked to their activation.</p>
          </div>
        </div>
      </section>

      {messages.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {messages.map((message) => (
            <Card key={message.code} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-text">{message.service}</div>
                  <div className="mt-1 text-sm text-muted">
                    {message.number} | {message.country}
                  </div>
                </div>
                <Badge variant={message.status === "Delivered" ? "success" : "warning"}>{message.status}</Badge>
              </div>

              <div className="grid gap-3 rounded-lg bg-[#F7F5ED] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted">Code</p>
                  <p className="mt-2 text-2xl font-semibold text-text num">{message.code}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Provider</p>
                  <p className="mt-2 text-sm text-text">{message.provider}</p>
                  <p className="mt-1 text-xs text-muted">{message.time}</p>
                </div>
              </div>

              <Button variant="secondary" className="w-full" onClick={() => copyCode(message.code)}>
                {copied === message.code ? <Check className="h-4 w-4 text-[#175C37]" /> : <Copy className="h-4 w-4" />}
                {copied === message.code ? "Copied" : "Copy code"}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-[#FAF9F4] p-10 text-center">
          <h2 className="text-xl font-semibold text-text">No verification messages yet.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
            Codes will appear here only after SMSBower returns a real message for an active order.
          </p>
        </Card>
      )}
    </div>
  );
}
