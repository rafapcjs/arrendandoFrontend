import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, UserCheck, Building2, FileText, LogOut, KeyRound, BarChart3, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/constants";
import { useLogout, ChangePasswordModal } from "@/features/auth/basic";

interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    icon: Home,
    href: ROUTES.DASHBOARD,
    description: "Panel principal"
  },
  {
    name: "Administradores",
    icon: Users,
    href: ROUTES.ADMIN,
    description: "Gestionar administradores"
  },
  {
    name: "Inquilinos",
    icon: UserCheck,
    href: ROUTES.TENANTS,
    description: "Gestionar inquilinos"
  },
  {
    name: "Inmuebles",
    icon: Building2,
    href: ROUTES.PROPERTIES,
    description: "Gestionar propiedades"
  },
  {
    name: "Contratos",
    icon: FileText,
    href: ROUTES.CONTRACTS,
    description: "Gestionar contratos"
  },
  {
    name: "Reportes",
    icon: BarChart3,
    href: ROUTES.REPORTS,
    description: "Reportes de ingresos"
  },
  {
    name: "Pagos",
    icon: CreditCard,
    href: ROUTES.PAYMENTS,
    description: "Gestión de pagos y deudas"
  },
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    toast.info(
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">¿Está seguro que desea cerrar sesión?</span>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              logoutMutation.mutate();
              setIsOpen(false);
              toast.dismiss();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Sí, cerrar sesión
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: false,
        className: "custom-toast-confirmation"
      }
    );
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-700" />
        ) : (
          <Menu className="w-6 h-6 text-slate-700" />
        )}
      </button>


      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Sistema de Arriendos</h2>
              <p className="text-blue-100 text-sm">Panel de navegación</p>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-600">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left group hover:bg-blue-50 text-blue-600 hover:text-blue-700 mb-2"
          >
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Cambiar contraseña</div>
              <div className="text-xs text-blue-500">
                Actualizar credenciales
              </div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left group hover:bg-red-50 text-red-600 hover:text-red-700 mb-2"
          >
            <div className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">
                {logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
              </div>
              <div className="text-xs text-red-500">
                Salir del sistema
              </div>
            </div>
          </button>
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Sistema de Gestión v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}