import { useAdminDashboardStats } from "../query/admin-dashboard-stats";
import { StatsCard } from "./StatsCard";
import {
  Users,
  UserCheck,
  Building,
  Building2,
  FileText,
  Calendar,
  XCircle,
  AlertCircle,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount);

export function AdminDashboardStats() {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 font-medium">Error al cargar estadísticas de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-8">

      {/* Usuarios */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-500 rounded-full" />
          Usuarios de la plataforma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard title="Total Usuarios" value={stats.usuarios.total} icon={Users} iconColor="text-blue-600" bgColor="bg-blue-100" description="Registrados en el sistema" />
          <StatsCard title="Usuarios Activos" value={stats.usuarios.activos} icon={UserCheck} iconColor="text-green-600" bgColor="bg-green-100" trend="up" trendValue={`${stats.usuarios.inactivos} inactivos`} description="Con acceso habilitado" />
          <StatsCard title="Rol Inmobiliaria" value={stats.usuarios.rolesInmobiliaria} icon={Building} iconColor="text-purple-600" bgColor="bg-purple-100" subtitle={`${stats.usuarios.rolesAdmin} admins`} description="Usuarios de inmobiliarias" />
        </div>
      </div>

      {/* Inmobiliarias */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-500 rounded-full" />
          Inmobiliarias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard title="Total Inmobiliarias" value={stats.inmobiliarias.total} icon={Building} iconColor="text-indigo-600" bgColor="bg-indigo-100" description="Empresas registradas" />
          <StatsCard title="Activas" value={stats.inmobiliarias.activas} icon={Building} iconColor="text-green-600" bgColor="bg-green-100" trend="up" trendValue="Operando" description="Inmobiliarias en operación" />
          <StatsCard title="Inactivas" value={stats.inmobiliarias.inactivas} icon={Building} iconColor="text-red-600" bgColor="bg-red-100" trend={stats.inmobiliarias.inactivas > 0 ? "down" : "up"} trendValue={stats.inmobiliarias.inactivas > 0 ? "Revisar" : "OK"} description="Deshabilitadas" />
        </div>
      </div>

      {/* Plataforma */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-slate-500 rounded-full" />
          Plataforma general
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard title="Total Inmuebles" value={stats.plataforma.totalInmuebles} icon={Building2} iconColor="text-indigo-600" bgColor="bg-indigo-100" description="En toda la plataforma" />
          <StatsCard title="Total Inquilinos" value={stats.plataforma.totalInquilinos} icon={Users} iconColor="text-teal-600" bgColor="bg-teal-100" description="Registrados" />
          <StatsCard title="Contratos Activos" value={stats.plataforma.contratosActivos} icon={FileText} iconColor="text-violet-600" bgColor="bg-violet-100" trend="up" trendValue={`${stats.plataforma.totalContratos} total`} description="Vigentes en la plataforma" />
          <StatsCard title="Próximos a Vencer" value={stats.plataforma.contratosProximosVencer} icon={Calendar} iconColor="text-yellow-600" bgColor="bg-yellow-100" trend={stats.plataforma.contratosProximosVencer > 3 ? "down" : "neutral"} trendValue={stats.plataforma.contratosProximosVencer > 3 ? "Revisar" : "OK"} description="Vencen en 30 días" />
          <StatsCard title="Contratos Vencidos" value={stats.plataforma.contratosVencidos} icon={XCircle} iconColor="text-red-600" bgColor="bg-red-100" trend={stats.plataforma.contratosVencidos > 0 ? "down" : "up"} trendValue={stats.plataforma.contratosVencidos > 0 ? "Urgente" : "Bien"} description="Requieren renovación" />
          <StatsCard title="Pagos Pendientes" value={stats.plataforma.pagosPendientes} icon={AlertCircle} iconColor="text-orange-600" bgColor="bg-orange-100" trend={stats.plataforma.pagosPendientes > 5 ? "down" : "neutral"} trendValue={`${stats.plataforma.pagosVencidos} vencidos`} description="Sin cobrar" />
        </div>
      </div>

      {/* Top Inmobiliarias */}
      {stats.topInmobiliarias.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-amber-500 rounded-full" />
            Top Inmobiliarias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topInmobiliarias.map((inmo, index) => (
              <div key={inmo.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                    #{index + 1}
                  </div>
                  <p className="font-semibold text-slate-800 truncate">{inmo.nombre}</p>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><span className="font-medium">Contratos:</span> {inmo.totalContratos}</p>
                  <p><span className="font-medium">Recaudado:</span> {formatCurrency(inmo.montoRecaudado)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
