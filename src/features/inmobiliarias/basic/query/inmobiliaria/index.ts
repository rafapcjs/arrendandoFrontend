import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getInmobiliariaById,
    createInmobiliaria,
    updateInmobiliaria,
    toggleEstadoInmobiliaria,
} from '../../service';
import type { CreateInmobiliariaDto, UpdateInmobiliariaDto } from '../../types/InmobiliariaModel';

export const useInmobiliaria = (id: string) => {
    return useQuery({
        queryKey: ['inmobiliaria', id],
        queryFn: () => getInmobiliariaById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateInmobiliaria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (inmobiliariaData: CreateInmobiliariaDto) => createInmobiliaria(inmobiliariaData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inmobiliarias'] });
            toast.success("Inmobiliaria creada exitosamente");
        },
        onError: (error) => {
            console.error('Create inmobiliaria error:', error);
            toast.error("Error al crear la inmobiliaria");
        },
    });
};

export const useUpdateInmobiliaria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updateData }: { id: string; updateData: UpdateInmobiliariaDto }) =>
            updateInmobiliaria(id, updateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['inmobiliarias'] });
            queryClient.setQueryData(['inmobiliaria', data.id], data);
            toast.success("Inmobiliaria actualizada exitosamente");
        },
        onError: (error) => {
            console.error('Update inmobiliaria error:', error);
            toast.error("Error al actualizar la inmobiliaria");
        },
    });
};

export const useToggleEstadoInmobiliaria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleEstadoInmobiliaria(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['inmobiliarias'] });
            queryClient.setQueryData(['inmobiliaria', data.id], data);
            toast.success(`Inmobiliaria ${data.estado === 'ACTIVA' ? 'activada' : 'desactivada'} exitosamente`);
        },
        onError: (error) => {
            console.error('Toggle estado inmobiliaria error:', error);
            toast.error("Error al cambiar el estado de la inmobiliaria");
        },
    });
};
