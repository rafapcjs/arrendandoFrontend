import { TenantManagement } from "@/features/tenants/basic";

export function TenantPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">
            Gestión de Inquilinos
          </h1>
          <p className="text-gray-600">
            Administra la información de todos los inquilinos del sistema
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <TenantManagement />
          </div>
        </section>
      </div>
    </div>
  );
}