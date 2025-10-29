import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getTenantById, 
    getTenantByCedula, 
    getTenantByEmail, 
    createTenant, 
    updateTenant, 
    activateTenant, 
    deleteTenant 
} from '../../service';
import type { CreateTenantDto, UpdateTenantDto, ActivateTenantDto } from '../../types/TenantModel';

export const useTenant = (id: string) => {
    return useQuery({
        queryKey: ['tenants', id],
        queryFn: () => getTenantById(id),
        enabled: !!id,
    });
};

export const useTenantByCedula = (cedula: string) => {
    return useQuery({
        queryKey: ['tenants', 'cedula', cedula],
        queryFn: () => getTenantByCedula(cedula),
        enabled: !!cedula,
    });
};

export const useTenantByEmail = (correo: string) => {
    return useQuery({
        queryKey: ['tenants', 'email', correo],
        queryFn: () => getTenantByEmail(correo),
        enabled: !!correo,
    });
};

export const useCreateTenant = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreateTenantDto) => createTenant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            toast.success("Inquilino creado exitosamente");
        },
        onError: (error) => {
            console.error('Create tenant error:', error);
            toast.error("Error al crear el inquilino");
        },
    });
};

export const useUpdateTenant = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTenantDto }) => 
            updateTenant(id, data),
        onSuccess: (updatedTenant) => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.setQueryData(['tenants', updatedTenant.id], updatedTenant);
            toast.success("Inquilino actualizado exitosamente");
        },
        onError: (error) => {
            console.error('Update tenant error:', error);
            toast.error("Error al actualizar el inquilino");
        },
    });
};

export const useActivateTenant = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ActivateTenantDto }) => 
            activateTenant(id, data),
        onSuccess: (updatedTenant) => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.setQueryData(['tenants', updatedTenant.id], updatedTenant);
            toast.success("Inquilino activado exitosamente");
        },
        onError: (error) => {
            console.error('Activate tenant error:', error);
            toast.error("Error al activar el inquilino");
        },
    });
};

export const useDeleteTenant = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            toast.success("Inquilino eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete tenant error:', error);
            toast.error("Error al eliminar el inquilino");
        },
    });
};