import { AdminProfileCard, AdminUserManagement } from "@/features/admin/basic";

export function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios y configuraciones del sistema
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AdminProfileCard />
          </div>

          <div className="lg:col-span-2">
            <AdminUserManagement />
          </div>
        </section>
      </div>
    </div>
  );
}
