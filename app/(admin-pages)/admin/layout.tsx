import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import { requireAdmin } from "@/lib/admin-auth/admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-64">
        <AdminHeader />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
