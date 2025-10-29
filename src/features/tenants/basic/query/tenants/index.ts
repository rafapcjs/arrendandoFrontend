import { useQuery } from '@tanstack/react-query';
import { getTenants, searchTenants } from '../../service';
import type { TenantSearchParams } from '../../types/TenantModel';

export const useTenants = (page?: number, limit?: number) => {
    return useQuery({
        queryKey: ['tenants', page, limit],
        queryFn: () => getTenants(page, limit),
        staleTime: 30 * 1000,
    });
};

export const useSearchTenants = (searchParams: TenantSearchParams) => {
    return useQuery({
        queryKey: ['tenants', 'search', searchParams],
        queryFn: () => searchTenants(searchParams),
        staleTime: 30 * 1000,
        enabled: !!(searchParams.search || searchParams.ciudad || searchParams.isActive !== undefined),
    });
};