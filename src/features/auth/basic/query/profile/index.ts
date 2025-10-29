import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../service';

export const useProfile = () => {
    return useQuery({
        queryKey: ['auth', 'profile'],
        queryFn: getProfile,
        staleTime: 5 * 60 * 1000,
    });
};