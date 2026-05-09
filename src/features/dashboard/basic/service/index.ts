import { ApiIntance } from "../../../../infrastructure/api";
import type { DashboardStats, AdminDashboardStats } from "../types/DashboardStatsModel";

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const { data } = await ApiIntance.get<DashboardStats>("/dashboard/stats");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
    try {
        const { data } = await ApiIntance.get<AdminDashboardStats>("/dashboard/admin-stats");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}