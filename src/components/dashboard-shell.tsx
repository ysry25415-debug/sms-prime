"use client";

import Link from "next/link";
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
import { cn } from "@/lib/utils";
import { useShellStore } from "@/stores/use-shell-store";
import { Button } from "@/components/ui/button";

const nav = [
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
    <div className="relative grid min-h-[calc(100vh-80px)] lg:grid-cols-[280px_1fr]">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-x-0 bottom-0 top-[80px] z-40 bg-black/50 lg:hidden"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-[80px] z-50 w-[280px] border-r border-white/8 bg-slate-950/95 p-4 shadow-glow backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:z-auto lg:h-[calc(100vh-80px)] lg:translate-x-0 lg:p-6",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 lg:block">
          <div>
            <div className="text-sm font-semibold text-text">SMSPrime Control Center</div>
            <div className="mt-1 text-xs text-muted">Familiar workflow, original identity</div>
          </div>
          <button type="button" className="rounded-xl border border-white/10 p-2 text-text lg:hidden" onClick={closeMobileNav} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileNav}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                  active
                    ? "border-primary/30 bg-primary/15 text-text"
                    : "border-transparent bg-transparent text-muted hover:border-white/8 hover:bg-white/5 hover:text-text"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-3 lg:hidden">
          <div>
            <div className="text-sm font-semibold text-text">SMSPrime</div>
            <div className="text-xs text-muted">Dashboard navigation</div>
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
