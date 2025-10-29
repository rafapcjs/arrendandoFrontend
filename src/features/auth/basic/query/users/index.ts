import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getUsers, getUserById, updateUser, activateUser, deleteUser } from '../../service';
import type { UpdateUserDto, ActivateUserDto } from '../../types/AuthenticactionModel';

export const useUsers = (page?: number, limit?: number) => {
    return useQuery({
        queryKey: ['auth', 'users', page, limit],
        queryFn: () => getUsers(page, limit),
        staleTime: 30 * 1000,
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['auth', 'users', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
            updateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
            queryClient.setQueryData(['auth', 'users', updatedUser.id], updatedUser);
            toast.success("Usuario actualizado exitosamente");
        },
        onError: (error) => {
            console.error('Update user error:', error);
            toast.error("Error al actualizar el usuario");
        },
    });
};

export const useActivateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ActivateUserDto }) => 
            activateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
            queryClient.setQueryData(['auth', 'users', updatedUser.id], updatedUser);
            toast.success("Usuario activado exitosamente");
        },
        onError: (error) => {
            console.error('Activate user error:', error);
            toast.error("Error al activar el usuario");
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
            toast.success("Usuario eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete user error:', error);
            toast.error("Error al eliminar el usuario");
        },
    });
};