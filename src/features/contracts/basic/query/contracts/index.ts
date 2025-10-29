import { useQuery } from '@tanstack/react-query';
import { getContracts } from '../../service';
import type { ContractSearchParams } from '../../types/ContractModel';

export const useContracts = (searchParams?: ContractSearchParams) => {
    return useQuery({
        queryKey: ['contracts', searchParams],
        queryFn: () => getContracts(searchParams),
        staleTime: 30 * 1000,
    });
};