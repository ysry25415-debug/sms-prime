export default function Loading() {
  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <div className="h-16 rounded-xl bg-[#EFECDD] animate-pulse" />
        <div className="h-[420px] rounded-xl bg-[#EFECDD] animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 rounded-xl bg-[#EFECDD] animate-pulse" />
          <div className="h-28 rounded-xl bg-[#EFECDD] animate-pulse" />
          <div className="h-28 rounded-xl bg-[#EFECDD] animate-pulse" />
          <div className="h-28 rounded-xl bg-[#EFECDD] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
