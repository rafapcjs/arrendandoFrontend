import { useQuery } from '@tanstack/react-query';
import { getAnnualIncomeReport } from '../../service';
import type { AnnualIncomeParams } from '../../types/ReportModel';

export const useAnnualIncomeReport = (params?: AnnualIncomeParams) => {
    return useQuery({
        queryKey: ['reports', 'annual-income', params],
        queryFn: () => getAnnualIncomeReport(params),
        staleTime: 30 * 1000,
    });
};