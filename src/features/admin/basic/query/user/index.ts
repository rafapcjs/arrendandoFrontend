import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getUserById, updateUser, activateUser, deleteUser } from '../../service';
import type { UpdateUserDto, ActivateUserDto } from '../../types/AdminModel';

export const useAdminUser = (id: string) => {
    return useQuery({
        queryKey: ['admin', 'users', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
};

export const useAdminUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
            updateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.setQueryData(['admin', 'users', updatedUser.id], updatedUser);
            toast.success("Usuario actualizado exitosamente");
        },
        onError: (error) => {
            console.error('Update user error:', error);
            toast.error("Error al actualizar el usuario");
        },
    });
};

export const useAdminActivateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ActivateUserDto }) => 
            activateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.setQueryData(['admin', 'users', updatedUser.id], updatedUser);
            toast.success("Usuario activado exitosamente");
        },
        onError: (error) => {
            console.error('Activate user error:', error);
            toast.error("Error al activar el usuario");
        },
    });
};

export const useAdminDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            toast.success("Usuario eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete user error:', error);
            toast.error("Error al eliminar el usuario");
        },
    });
};