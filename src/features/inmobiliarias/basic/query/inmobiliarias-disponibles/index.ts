import { useQuery } from '@tanstack/react-query';
import { getInmobiliariasDisponibles } from '../../service';

export const useInmobiliariasDisponibles = () => {
    return useQuery({
        queryKey: ['inmobiliarias', 'disponibles'],
        queryFn: () => getInmobiliariasDisponibles(),
        staleTime: 5 * 60 * 1000,
    });
};
