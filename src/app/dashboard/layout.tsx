import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
