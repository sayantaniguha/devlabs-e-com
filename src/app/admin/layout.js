import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/Toaster";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const profile = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-dl-chalk">
      <AdminSidebar profile={profile} />
      <main className="ml-[260px] flex-1 flex flex-col min-h-screen">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
