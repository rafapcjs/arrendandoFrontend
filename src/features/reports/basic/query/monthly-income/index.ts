import { useQuery } from '@tanstack/react-query';
import { getMonthlyIncomeReport } from '../../service';
import type { MonthlyIncomeParams } from '../../types/ReportModel';

export const useMonthlyIncomeReport = (params?: MonthlyIncomeParams) => {
    return useQuery({
        queryKey: ['reports', 'monthly-income', params],
        queryFn: () => getMonthlyIncomeReport(params),
        staleTime: 30 * 1000,
    });
};