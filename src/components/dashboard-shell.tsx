"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Blocks,
  Coins,
  LayoutDashboard,
  Menu,
  MessageSquareMore,
  Settings,
  ShieldCheck,
  WalletCards,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShellStore } from "@/stores/use-shell-store";
import { Button } from "@/components/ui/button";

const nav: Array<{ href: Route; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/wallet", label: "Wallet", icon: WalletCards },
  { href: "/dashboard/transactions", label: "Transactions", icon: Coins },
  { href: "/dashboard/orders", label: "Orders", icon: BarChart3 },
  { href: "/dashboard/sms-messages", label: "SMS Messages", icon: MessageSquareMore },
  { href: "/dashboard/api-keys", label: "API Keys", icon: ShieldCheck },
  { href: "/dashboard/developers", label: "Developers", icon: Blocks },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: MessageSquareMore }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useShellStore();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F1EEDC] lg:grid lg:grid-cols-[228px_minmax(0,1fr)]">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/20 lg:hidden"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-50 flex w-[228px] flex-col bg-[#F1EEDC] p-4 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-[calc(100vh-64px)] lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2 lg:block">
          <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E5B928] text-sm font-bold text-text">SP</span><span className="text-sm font-semibold text-text">SMSPrime</span></div>
          <div className="mt-4 rounded-lg border border-[#DED9C7] bg-[#F7F5ED] px-3 py-2 text-xs text-muted">Personal workspace</div>
          <button type="button" className="rounded-lg border border-border p-2 text-text lg:hidden" onClick={closeMobileNav} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileNav}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm transition",
                  active
                    ? "bg-white text-text"
                    : "text-muted hover:bg-[#F7F5ED] hover:text-text"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-[#9A6700]")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 bg-white p-5 lg:m-2 lg:rounded-2xl lg:border lg:border-border lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <div>
            <div className="text-sm font-semibold text-text">SMSPrime</div>
            <div className="text-xs text-muted">Personal workspace</div>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleMobileNav}>
            <Menu className="h-4 w-4" />
            Menu
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
