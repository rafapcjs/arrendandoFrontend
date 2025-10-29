import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../service';

export const useAdminUsers = (page?: number, limit?: number) => {
    return useQuery({
        queryKey: ['admin', 'users', page, limit],
        queryFn: () => getUsers(page, limit),
        staleTime: 30 * 1000,
    });
};