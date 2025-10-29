import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getPropertyById, 
    createProperty, 
    updateProperty, 
    deleteProperty, 
    activateProperty,
    searchPropertiesByAddress
} from '../../service';
import type { CreatePropertyDto, UpdatePropertyDto, ActivatePropertyDto } from '../../types/PropertyModel';

export const useProperty = (id: string) => {
    return useQuery({
        queryKey: ['property', id],
        queryFn: () => getPropertyById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (propertyData: CreatePropertyDto) => createProperty(propertyData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            toast.success("Propiedad creada exitosamente");
        },
        onError: (error) => {
            console.error('Create property error:', error);
            toast.error("Error al crear la propiedad");
        },
    });
};

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, updateData }: { id: string; updateData: UpdatePropertyDto }) => 
            updateProperty(id, updateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.setQueryData(['property', data.id], data);
            toast.success("Propiedad actualizada exitosamente");
        },
        onError: (error) => {
            console.error('Update property error:', error);
            toast.error("Error al actualizar la propiedad");
        },
    });
};

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteProperty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            toast.success("Propiedad eliminada exitosamente");
        },
        onError: (error) => {
            console.error('Delete property error:', error);
            toast.error("Error al eliminar la propiedad");
        },
    });
};

export const useActivateProperty = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, activateData }: { id: string; activateData: ActivatePropertyDto }) => 
            activateProperty(id, activateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.setQueryData(['property', data.id], data);
            toast.success("Propiedad activada exitosamente");
        },
        onError: (error) => {
            console.error('Activate property error:', error);
            toast.error("Error al activar la propiedad");
        },
    });
};

export const useSearchPropertiesByAddress = (direccion: string) => {
    return useQuery({
        queryKey: ['properties', 'address', direccion],
        queryFn: () => searchPropertiesByAddress(direccion),
        enabled: !!direccion && direccion.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};