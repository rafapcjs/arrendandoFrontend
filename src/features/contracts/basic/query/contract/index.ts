import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getContractById, 
    createContract, 
    updateContract, 
    deleteContract 
} from '../../service';
import type { CreateContractDto, UpdateContractDto } from '../../types/ContractModel';

export const useContract = (id: string) => {
    return useQuery({
        queryKey: ['contracts', id],
        queryFn: () => getContractById(id),
        staleTime: 30 * 1000,
        enabled: !!id,
    });
};

export const useCreateContract = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreateContractDto) => createContract(data),
        onSuccess: () => {
            // Invalidate contracts query
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            // Invalidate tenants and properties queries to refresh dropdowns
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            toast.success("Contrato creado exitosamente");
        },
        onError: (error) => {
            console.error('Create contract error:', error);
            toast.error("Error al crear el contrato");
        },
    });
};

export const useUpdateContract = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateContractDto }) => 
            updateContract(id, data),
        onSuccess: (updatedContract) => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.setQueryData(['contracts', updatedContract.id], updatedContract);
            toast.success("Contrato actualizado exitosamente");
        },
        onError: (error) => {
            console.error('Update contract error:', error);
            toast.error("Error al actualizar el contrato");
        },
    });
};

export const useDeleteContract = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteContract(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            toast.success("Contrato eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete contract error:', error);
            toast.error("Error al eliminar el contrato");
        },
    });
};