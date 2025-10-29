import { useQuery } from '@tanstack/react-query';
import { getComparisonReport } from '../../service';
import type { ComparisonReportParams } from '../../types/ReportModel';

export const useComparisonReport = (params?: ComparisonReportParams) => {
    return useQuery({
        queryKey: ['reports', 'comparison', params],
        queryFn: () => getComparisonReport(params),
        staleTime: 30 * 1000,
    });
};