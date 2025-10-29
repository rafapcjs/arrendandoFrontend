import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../shared/components/common/ProtectedRoute";
import { LoginForm } from "../../pages/login";
import { DashboardGrid } from "../../pages/dashboard";
import { AdminPanel } from "../../features/admin/basic/components/AdminPanel";
import { TenantPanel } from "../../features/tenants/basic";
import { PropertyPanel } from "../../features/properties/basic";
import { ContractPanel } from "../../features/contracts/basic";
import { ReportsPage } from "../../pages/reports";
import PaymentsPage from "../../pages/payments";
import { NotFoundPage } from "../../pages/not-found";
import { ROUTES } from "../../shared/constants";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path={ROUTES.HOME} element={<LoginForm />} />

        {/* Dashboard principal */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardGrid />
            </ProtectedRoute>
          }
        />

        {/* Panel de administración - Solo para admins */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Panel de inquilinos */}
        <Route
          path={ROUTES.TENANTS}
          element={
            <ProtectedRoute>
              <TenantPanel />
            </ProtectedRoute>
          }
        />

        {/* Panel de inmuebles */}
        <Route
          path={ROUTES.PROPERTIES}
          element={
            <ProtectedRoute>
              <PropertyPanel />
            </ProtectedRoute>
          }
        />

        {/* Panel de contratos */}
        <Route
          path={ROUTES.CONTRACTS}
          element={
            <ProtectedRoute>
              <ContractPanel />
            </ProtectedRoute>
          }
        />


        {/* Panel de reportes */}
        <Route
          path={ROUTES.REPORTS}
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Panel de pagos */}
        <Route
          path={ROUTES.PAYMENTS}
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />

        {/* Catch all - redirige a 404 para rutas no encontradas */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}