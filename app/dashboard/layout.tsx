import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 md:px-6">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 py-2">{children}</div>
    </div>
  );
}
