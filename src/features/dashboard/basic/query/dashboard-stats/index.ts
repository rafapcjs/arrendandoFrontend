import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../service";
import type { DashboardStats } from "../../types/DashboardStatsModel";

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
        staleTime: 10000, // Consider data stale after 10 seconds
    });
};