"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <section className="rounded-[28px] border border-white/8 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted">SMS Messages</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Monitor delivery status and copy verification codes instantly.</h1>
          </div>
          <Input className="w-full lg:w-72" placeholder="Search messages..." />
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

              <div className="grid gap-3 rounded-2xl border border-white/8 bg-white/5 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Code</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">{message.code}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Provider</p>
                  <p className="mt-2 text-sm text-text">{message.provider}</p>
                  <p className="mt-1 text-xs text-muted">{message.time}</p>
                </div>
              </div>

              <Button variant="secondary" className="w-full" onClick={() => copyCode(message.code)}>
                {copied === message.code ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                {copied === message.code ? "Copied" : "Copy code"}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
          <h2 className="text-xl font-semibold text-text">No verification messages yet.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
            Codes will appear here only after SMSBower returns a real message for an active order.
          </p>
        </Card>
      )}
    </div>
  );
}
