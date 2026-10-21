"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type BalanceResponse =
  | { ok: true; data: { balance: string }; raw?: string }
  | { ok: false; error: string; raw?: string };

async function fetchBalance(): Promise<BalanceResponse> {
  const response = await fetch("/api/providers/smsbower?action=getBalance", {
    method: "GET",
    cache: "no-store"
  });

  return (await response.json()) as BalanceResponse;
}

export function LiveBalanceCard() {
  const query = useQuery({
    queryKey: ["smsbower", "balance"],
    queryFn: fetchBalance,
    refetchInterval: 60_000,
    retry: false
  });

  const balance = query.data && "ok" in query.data && query.data.ok ? query.data.data.balance : null;
  const error = query.data && "ok" in query.data && !query.data.ok ? query.data.error : null;

  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardDescription>Provider balance</CardDescription>
          <CardTitle className="mt-1 text-3xl num">{query.isLoading ? "Loading..." : balance ?? "—"}</CardTitle>
        </div>
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5B928]" />
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#F0D47A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#714A00]">
          <AlertTriangle className="h-4 w-4" />
          {error.includes("Provider API key")
            ? "SMSBOWER_API_KEY is missing in Vercel. Add it to show the real SMSBower balance."
            : error}
        </div>
      ) : (
        <p className="text-sm leading-6 text-muted">Balance is read through the server route; the provider key is never sent to the browser.</p>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => query.refetch()}
        className="self-start"
        disabled={query.isFetching}
      >
        <RefreshCcw className="h-4 w-4" />
        {query.isFetching ? "Refreshing..." : "Refresh balance"}
      </Button>
    </Card>
  );
}
