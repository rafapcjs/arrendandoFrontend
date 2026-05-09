import { useQuery } from '@tanstack/react-query';
import { getPropietarios } from '../../service';

export const usePropietarios = () => {
    return useQuery({
        queryKey: ['propietarios'],
        queryFn: () => getPropietarios(),
        staleTime: 5 * 60 * 1000,
    });
};
