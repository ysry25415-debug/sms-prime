"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border border-white/8 bg-hero-grid px-6 py-12 shadow-glow lg:px-10 lg:py-16"
    >
      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{ opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
          animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-0 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Trusted SMS verification workflow
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Ready-to-use SMS verification tools built for speed, trust, and clarity.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              SMSPrime gives teams a clean dashboard for buying numbers, tracking codes, managing wallet balance, and keeping delivery flows organized without visual clutter.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input className="h-12 border-white/10 bg-slate-950/40 pl-10" placeholder="Search Telegram, WhatsApp, Google..." />
            </div>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-medium text-white shadow-[0_12px_30px_rgba(59,130,246,0.28)] transition hover:bg-blue-500"
            >
              Explore dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-base font-medium text-text transition hover:border-blue-400/50 hover:bg-white/10"
            >
              Create account
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Zap className="h-4 w-4 text-amber-300" />
              Instant feedback
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Reliable providers
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-white/10 bg-slate-950/45 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Quick purchase flow</p>
                <h2 className="text-xl font-semibold text-text">Buy number in 3 steps</h2>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                Preview
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["1", "Choose service", "Search from provider list"],
                ["2", "Select country", "See live price and stock"],
                ["3", "Reserve number", "Start real order timer"]
              ].map(([step, title, detail]) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 font-semibold text-primary">
                    {step}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text">{title}</div>
                    <div className="text-xs text-muted">{detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-gradient-to-br from-blue-500/15 to-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Order timer</span>
                <span className="text-sm font-semibold text-text">Starts after purchase</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
