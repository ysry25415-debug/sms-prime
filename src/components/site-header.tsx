"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="border-b border-[#E7DFBE] bg-[#FFFDF5]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SMSPrime home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E5B928] text-sm font-bold text-[#1E1D19]">SP</span>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-text">SMSPrime</span>
        </Link>
        {!isDashboard ? (
          <nav className="ml-6 hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Main navigation">
            <a className="transition hover:text-text" href="#numbers">Numbers</a>
            <a className="transition hover:text-text" href="#how-it-works">How it works</a>
            <Link className="transition hover:text-text" href="/subscription">Plans</Link>
            <Link className="transition hover:text-text" href="/support">Support</Link>
          </nav>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {isDashboard ? (
            <Link href="/dashboard/profile"><Button variant="secondary" size="sm">Account</Button></Link>
          ) : (
            <>
              <Link className="px-3 text-sm font-medium text-text" href="/login">Sign in</Link>
              <Link href="/register"><Button size="sm">Create account</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


