import { useQuery } from '@tanstack/react-query';
import { getInmobiliarias } from '../../service';

export const useInmobiliarias = () => {
    return useQuery({
        queryKey: ['inmobiliarias'],
        queryFn: () => getInmobiliarias(),
        staleTime: 5 * 60 * 1000,
    });
};
