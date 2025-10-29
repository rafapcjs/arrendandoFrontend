import { useQuery } from '@tanstack/react-query';
import { getActiveContracts } from '../../service';

export const useActiveContracts = () => {
    return useQuery({
        queryKey: ['contracts', 'active'],
        queryFn: getActiveContracts,
        staleTime: 30 * 1000,
    });
};