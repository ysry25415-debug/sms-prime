"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCcw, Wallet } from "lucide-react";
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
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardDescription>SMSBower balance</CardDescription>
          <CardTitle className="mt-1 text-3xl">{query.isLoading ? "Loading..." : balance ?? "--"}</CardTitle>
        </div>
        <div className="rounded-2xl bg-primary/15 p-3 text-primary">
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          {error.includes("Provider API key") ? "Provider balance will appear after SMSBower is configured." : error}
        </div>
      ) : (
        <p className="text-sm text-muted">Live provider balance is pulled through the secure internal API layer.</p>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => query.refetch()}
        className="w-full"
        disabled={query.isFetching}
      >
        <RefreshCcw className="h-4 w-4" />
        {query.isFetching ? "Refreshing..." : "Refresh balance"}
      </Button>
    </Card>
  );
}
