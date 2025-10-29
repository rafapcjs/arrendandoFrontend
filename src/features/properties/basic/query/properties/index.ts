import { useQuery } from '@tanstack/react-query';
import { getProperties, searchProperties } from '../../service';
import type { PropertySearchParams } from '../../types/PropertyModel';

export const useProperties = (page?: number, limit?: number) => {
    return useQuery({
        queryKey: ['properties', page, limit],
        queryFn: () => getProperties(page, limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useSearchProperties = (searchParams: PropertySearchParams) => {
    return useQuery({
        queryKey: ['properties', 'search', searchParams],
        queryFn: () => searchProperties(searchParams),
        enabled: !!(searchParams.search || searchParams.disponible !== undefined),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};