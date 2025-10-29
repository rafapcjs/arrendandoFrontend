import { PropertyManagement } from "@/features/properties/basic";

export function PropertyPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Gestión de Inmuebles
          </h1>
          <p className="text-gray-600">
            Administra todas las propiedades y ubicaciones del sistema
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <PropertyManagement />
          </div>
        </section>
      </div>
    </div>
  );
}