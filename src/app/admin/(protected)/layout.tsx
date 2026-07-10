import { getCurrentAdmin } from "@/lib/dal";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Redirects to /admin/login if there is no valid session.
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar admin={{ name: admin.name, role: admin.role }} />
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
