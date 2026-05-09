import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getPropietarioById,
    createPropietario,
    updatePropietario,
    activatePropietario,
    deletePropietario,
} from '../../service';
import type { CreatePropietarioDto, UpdatePropietarioDto, ActivatePropietarioDto } from '../../types/PropietarioModel';

export const usePropietario = (id: string) => {
    return useQuery({
        queryKey: ['propietario', id],
        queryFn: () => getPropietarioById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreatePropietario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (propietarioData: CreatePropietarioDto) => createPropietario(propietarioData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['propietarios'] });
            toast.success("Propietario creado exitosamente");
        },
        onError: (error) => {
            console.error('Create propietario error:', error);
            toast.error("Error al crear el propietario");
        },
    });
};

export const useUpdatePropietario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updateData }: { id: string; updateData: UpdatePropietarioDto }) =>
            updatePropietario(id, updateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['propietarios'] });
            queryClient.setQueryData(['propietario', data.id], data);
            toast.success("Propietario actualizado exitosamente");
        },
        onError: (error) => {
            console.error('Update propietario error:', error);
            toast.error("Error al actualizar el propietario");
        },
    });
};

export const useActivatePropietario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, activateData }: { id: string; activateData: ActivatePropietarioDto }) =>
            activatePropietario(id, activateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['propietarios'] });
            queryClient.setQueryData(['propietario', data.id], data);
            toast.success(`Propietario ${data.isActive ? 'activado' : 'desactivado'} exitosamente`);
        },
        onError: (error) => {
            console.error('Activate propietario error:', error);
            toast.error("Error al cambiar el estado del propietario");
        },
    });
};

export const useDeletePropietario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePropietario(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['propietarios'] });
            toast.success("Propietario eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete propietario error:', error);
            toast.error("Error al eliminar el propietario");
        },
    });
};
