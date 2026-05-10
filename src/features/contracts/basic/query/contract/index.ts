import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    uploadContractDocument,
    replaceContractDocument,
    deleteContractDocument,
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
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success("Contrato eliminado exitosamente");
        },
        onError: (error) => {
            console.error('Delete contract error:', error);
            toast.error("Error al eliminar el contrato");
        },
    });
};

export const useUploadContractDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contractId, file }: { contractId: string; file: File }) =>
            uploadContractDocument(contractId, file),
        onSuccess: (updatedContract) => {
            queryClient.setQueryData(['contracts', updatedContract.id], updatedContract);
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success("Documento subido exitosamente");
        },
        onError: () => {
            toast.error("Error al subir el documento");
        },
    });
};

export const useReplaceContractDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contractId, docId, file }: { contractId: string; docId: string; file: File }) =>
            replaceContractDocument(contractId, docId, file),
        onSuccess: (updatedContract) => {
            queryClient.setQueryData(['contracts', updatedContract.id], updatedContract);
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success("Documento reemplazado exitosamente");
        },
        onError: () => {
            toast.error("Error al reemplazar el documento");
        },
    });
};

export const useDeleteContractDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contractId, docId }: { contractId: string; docId: string }) =>
            deleteContractDocument(contractId, docId),
        onSuccess: (updatedContract) => {
            queryClient.setQueryData(['contracts', updatedContract.id], updatedContract);
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success("Documento eliminado exitosamente");
        },
        onError: () => {
            toast.error("Error al eliminar el documento");
        },
    });
};