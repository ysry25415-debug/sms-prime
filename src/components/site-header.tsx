"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Settings, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow">
            <span className="text-sm font-bold">SP</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.16em] text-text">SMSPrime</div>
            <div className="text-xs text-muted">Secure SMS operations</div>
          </div>
        </Link>

        <div className="hidden flex-1 lg:block">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input className="pl-10" placeholder={isDashboard ? "Search services, countries, orders..." : "Search services, pricing, docs..."} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isDashboard ? (
            <>
              <Button variant="secondary" size="sm" className="hidden md:inline-flex">
                <Bell className="h-4 w-4" />
                Alerts
              </Button>
              <Button variant="secondary" size="sm" className="hidden md:inline-flex">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="hidden rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-text md:block">
                Balance: <span className="font-semibold text-emerald-300">$2,480.90</span>
              </div>
              <Button variant="primary" size="sm">
                <UserCircle2 className="h-4 w-4" />
                Profile
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-text transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
