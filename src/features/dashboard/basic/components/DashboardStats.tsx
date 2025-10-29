import { useDashboardStats } from "../query/dashboard-stats";
import { StatsCard } from "./StatsCard";
import { 
  Users, 
  UserCheck, 
  Building2, 
  FileText, 
 
  TrendingUp,
  Calendar,
  XCircle
} from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-200 animate-pulse rounded"></div>
          <div className="w-48 h-6 bg-slate-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-40 bg-slate-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-full">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error al cargar estadísticas</h3>
            <p className="text-red-700 text-sm">No se pudieron cargar las estadísticas del dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Estadísticas del Sistema</h2>
      </div>
      
      {/* Métricas principales destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        
        <StatsCard
          title="Tasa de Ocupación"
          value={`${stats.tasaOcupacion}%`}
          icon={TrendingUp}
          iconColor="text-blue-700"
          bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          trend={stats.tasaOcupacion >= 80 ? "up" : stats.tasaOcupacion >= 60 ? "neutral" : "down"}
          trendValue={stats.tasaOcupacion >= 80 ? "Excelente" : stats.tasaOcupacion >= 60 ? "Buena" : "Mejorar"}
          description="Porcentaje de inmuebles ocupados"
        />
        
        
        <StatsCard
          title="Contratos Activos"
          value={stats.contratosActivos}
          icon={FileText}
          iconColor="text-violet-700"
          bgColor="bg-gradient-to-br from-violet-100 to-violet-200"
          trend="up"
          trendValue="+5"
          description="Contratos vigentes actualmente"
        />
      </div>

      {/* Secciones organizadas por categorías */}
      <div className="space-y-8">
        {/* Gestión de Usuarios */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Gestión de Usuarios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Usuarios"
              value={stats.totalUsuarios}
              icon={Users}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
              subtitle="registrados"
              description="Usuarios totales en el sistema"
            />
            
            <StatsCard
              title="Usuarios Activos"
              value={stats.usuariosActivos}
              icon={UserCheck}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              trend="up"
              trendValue="+2"
              description="Usuarios con sesiones activas"
            />

            <StatsCard
              title="Total Inquilinos"
              value={stats.totalInquilinos}
              icon={Users}
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
              subtitle="inquilinos"
              description="Inquilinos registrados"
            />
            
            <StatsCard
              title="Inquilinos Activos"
              value={stats.inquilinosActivos}
              icon={UserCheck}
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
              trend="up"
              trendValue="+1"
              description="Con contratos vigentes"
            />
          </div>
        </div>

        {/* Gestión de Inmuebles */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            Gestión de Inmuebles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Inmuebles"
              value={stats.totalInmuebles}
              icon={Building2}
              iconColor="text-indigo-600"
              bgColor="bg-indigo-100"
              subtitle="propiedades"
              description="Inmuebles en la plataforma"
            />
            
            <StatsCard
              title="Inmuebles Disponibles"
              value={stats.inmueblesDisponibles}
              icon={Building2}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              trend="neutral"
              trendValue="Estable"
              description="Listos para arrendar"
            />
            
            <StatsCard
              title="Inmuebles Ocupados"
              value={stats.inmueblesOcupados}
              icon={Building2}
              iconColor="text-orange-600"
              bgColor="bg-orange-100"
              trend="up"
              trendValue="+3"
              description="Actualmente arrendados"
            />
          </div>
        </div>

        {/* Gestión de Contratos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-slate-500 rounded-full"></div>
            Gestión de Contratos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Contratos"
              value={stats.totalContratos}
              icon={FileText}
              iconColor="text-slate-600"
              bgColor="bg-slate-100"
              subtitle="contratos"
              description="Contratos totales registrados"
            />
            
            <StatsCard
              title="Próximos a Vencer"
              value={stats.contratosProximosVencer}
              icon={Calendar}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-100"
              trend={stats.contratosProximosVencer > 3 ? "down" : "up"}
              trendValue={stats.contratosProximosVencer > 3 ? "Revisar" : "OK"}
              description="Vencen en 30 días"
            />
            
            <StatsCard
              title="Contratos Vencidos"
              value={stats.contratosVencidos}
              icon={XCircle}
              iconColor="text-red-600"
              bgColor="bg-red-100"
              trend={stats.contratosVencidos > 0 ? "down" : "up"}
              trendValue={stats.contratosVencidos > 0 ? "Urgente" : "Bien"}
              description="Requieren renovación"
            />

          </div>
        </div>

      </div>
    </div>
  );
}