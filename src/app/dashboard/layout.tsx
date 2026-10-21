import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[100dvh]">
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}


