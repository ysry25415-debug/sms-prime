export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-[28px] border border-white/8 bg-white/5 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 rounded-2xl border border-white/8 bg-white/5 animate-pulse" />
        <div className="h-28 rounded-2xl border border-white/8 bg-white/5 animate-pulse" />
        <div className="h-28 rounded-2xl border border-white/8 bg-white/5 animate-pulse" />
        <div className="h-28 rounded-2xl border border-white/8 bg-white/5 animate-pulse" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="h-[540px] rounded-[28px] border border-white/8 bg-white/5 animate-pulse" />
        <div className="h-[540px] rounded-[28px] border border-white/8 bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
