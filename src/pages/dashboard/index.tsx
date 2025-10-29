import { Card } from "@/shared/components/ui/card"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  UserCheck, 
  Building2, 
  BarChart3, 
  Home, 
  Star,
  ArrowRight,
  Clock,
  Shield,
  Settings,
  FileText,
  CreditCard
} from "lucide-react"
import { DashboardStats } from "@/features/dashboard/basic/components/DashboardStats"

const dashboardItems = [
  {
    name: "Gestionar Administradores",
    icon: Users,
    href: "/admin",
    description: "Administra usuarios del sistema",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
    category: "Usuarios",
    priority: "high"
  },
  {
    name: "Gestionar Inquilinos",
    icon: UserCheck,
    href: "/tenants",
    description: "Gestiona información de inquilinos",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    hoverColor: "hover:from-green-600 hover:to-green-700",
    category: "Usuarios",
    priority: "high"
  },
  {
    name: "Gestionar Inmuebles",
    icon: Building2,
    href: "/properties",
    description: "Administra propiedades y ubicaciones",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
    category: "Propiedades",
    priority: "high"
  },
  {
    name: "Gestionar Contratos",
    icon: FileText,
    href: "/contracts",
    description: "Administra contratos de arrendamiento",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    hoverColor: "hover:from-orange-600 hover:to-orange-700",
    category: "Documentos",
    priority: "high"
  },
  {
    name: "Gestionar Pagos",
    icon: CreditCard,
    href: "/payments",
    description: "Controla pagos, abonos y estado de deudas",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
    category: "Finanzas",
    priority: "high"
  },
  {
    name: "Reportes y Estadísticas",
    icon: BarChart3,
    href: "/reports",
    description: "Genera reportes y estadísticas",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
    category: "Análisis",
    priority: "medium"
  },
]

export function DashboardGrid() {
  const navigate = useNavigate()

  const handleNavigation = (href: string) => {
    navigate(href)
  }

  // Agrupar items por categoría
  const highPriorityItems = dashboardItems.filter(item => item.priority === "high")
  const mediumPriorityItems = dashboardItems.filter(item => item.priority === "medium")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
                    <Home className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800">¡Bienvenido al Dashboard!</h1>
                    <p className="text-slate-600 text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Sistema de Gestión de Arriendos
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                  <div className="flex items-start gap-3 mb-3">
                    <Star className="w-6 h-6 text-yellow-500 fill-current flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Panel de Control Principal</h3>
                      <p className="text-slate-700 leading-relaxed">
                        Gestiona tu negocio de arriendos de manera eficiente. Accede a estadísticas en tiempo real, 
                        administra usuarios e inmuebles, y mantén el control total de tus operaciones.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-blue-200/50">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Última actualización: Hoy</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Sistema operativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Acciones Principales */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">Acciones Principales</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highPriorityItems.map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.name}
                    className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-white border border-slate-200 overflow-hidden relative"
                    onClick={() => handleNavigation(item.href)}
                  >
                    {/* Priority indicator */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl ${item.color} ${item.hoverColor} flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                          <Icon className="w-7 h-7" strokeWidth={2} />
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom accent */}
                    <div className={`h-1 ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Herramientas Adicionales */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">Herramientas y Análisis</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediumPriorityItems.map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.name}
                    className="group cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-102 bg-white border border-slate-200 overflow-hidden"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg ${item.color} ${item.hoverColor} flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-md`}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                              {item.name}
                            </h3>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                          <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">
                            {item.description}
                          </p>
                          <div className="mt-3">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Sistema de Gestión de Arriendos v1.0</p>
                    <p className="text-sm text-slate-600">Administra tu negocio de manera eficiente</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Todo funcionando correctamente</span>
                  </div>
                  <p className="text-xs text-slate-500">Última verificación: Ahora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
