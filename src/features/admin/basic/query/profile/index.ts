import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '../../service';

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ['admin', 'profile'],
        queryFn: getAdminProfile,
        staleTime: 5 * 60 * 1000,
    });
};