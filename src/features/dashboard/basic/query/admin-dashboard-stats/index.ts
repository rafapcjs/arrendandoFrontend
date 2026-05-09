import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "../../service";
import type { AdminDashboardStats } from "../../types/DashboardStatsModel";

export const useAdminDashboardStats = () => {
    return useQuery<AdminDashboardStats>({
        queryKey: ["dashboard", "admin-stats"],
        queryFn: getAdminDashboardStats,
        refetchInterval: 30000,
        staleTime: 10000,
    });
};
