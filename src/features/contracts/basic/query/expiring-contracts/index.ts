import { useQuery } from '@tanstack/react-query';
import { getExpiringContracts } from '../../service';

export const useExpiringContracts = (days: number = 30) => {
    return useQuery({
        queryKey: ['contracts', 'expiring', days],
        queryFn: () => getExpiringContracts(days),
        staleTime: 30 * 1000,
    });
};