import { AdminDashboardStats } from "./AdminDashboardStats";
import { InmobiliariaDashboardStats } from "./InmobiliariaDashboardStats";
import { isAdmin } from "../../../../shared/lib/session";

export function DashboardStats() {
  if (isAdmin()) return <AdminDashboardStats />;
  return <InmobiliariaDashboardStats />;
}
