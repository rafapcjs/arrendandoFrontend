import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    Contract,
    ContractsResponse,
    CreateContractDto,
    UpdateContractDto,
    ContractSearchParams,
    ActiveContract,
    ExpiringContract
} from "../types/ContractModel";

export const createContract = async (contractData: CreateContractDto): Promise<Contract> => {
    try {
        // Format dates to ISO string
        const formattedContractData = {
            ...contractData,
            fechaInicio: new Date(contractData.fechaInicio).toISOString(),
            fechaFin: new Date(contractData.fechaFin).toISOString(),
        };
        
        console.log('Sending contract data:', formattedContractData);
        const { data } = await ApiIntance.post<Contract>("/contratos", formattedContractData);
        return data;
    } catch (error: unknown) {
        console.error('Contract creation error:', error);
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as { response?: { data?: unknown; status?: number } };
            console.error('Error response:', axiosError.response?.data);
            console.error('Error status:', axiosError.response?.status);
        }
        throw error;
    }
}

export const getContracts = async (searchParams?: ContractSearchParams): Promise<ContractsResponse> => {
    try {
        const params = new URLSearchParams();
        if (searchParams?.page) params.append('page', searchParams.page.toString());
        if (searchParams?.limit) params.append('limit', searchParams.limit.toString());
        if (searchParams?.estado) params.append('estado', searchParams.estado);
        if (searchParams?.inquilinoNombre?.trim()) params.append('inquilinoNombre', searchParams.inquilinoNombre.trim());
        
        const { data } = await ApiIntance.get<ContractsResponse>(`/contratos?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getActiveContracts = async (): Promise<ActiveContract[]> => {
    try {
        const { data } = await ApiIntance.get<ActiveContract[]>("/contratos/activos");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getExpiringContracts = async (days: number = 30): Promise<ExpiringContract[]> => {
    try {
        const { data } = await ApiIntance.get<ExpiringContract[]>(`/contratos/proximos-vencer/${days}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getContractById = async (id: string): Promise<Contract> => {
    try {
        const { data } = await ApiIntance.get<Contract>(`/contratos/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateContract = async (id: string, updateData: UpdateContractDto): Promise<Contract> => {
    try {
        // Format dates to ISO string if they exist
        const formattedUpdateData = {
            ...updateData,
            ...(updateData.fechaInicio && { fechaInicio: new Date(updateData.fechaInicio).toISOString() }),
            ...(updateData.fechaFin && { fechaFin: new Date(updateData.fechaFin).toISOString() }),
        };
        
        console.log('Updating contract with data:', formattedUpdateData);
        const { data } = await ApiIntance.patch<Contract>(`/contratos/${id}`, formattedUpdateData);
        return data;
    } catch (error: unknown) {
        console.error('Contract update error:', error);
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as { response?: { data?: unknown; status?: number } };
            console.error('Error response:', axiosError.response?.data);
            console.error('Error status:', axiosError.response?.status);
        }
        throw error;
    }
}

export const deleteContract = async (id: string): Promise<void> => {
    try {
        console.log('Deleting contract with ID:', id);
        await ApiIntance.delete(`/contratos/${id}`);
    } catch (error: unknown) {
        console.error('Contract deletion error:', error);
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as { response?: { data?: unknown; status?: number } };
            console.error('Error response:', axiosError.response?.data);
            console.error('Error status:', axiosError.response?.status);
        }
        throw error;
    }
}

export const checkPropertyHasActiveContract = async (propertyId: string): Promise<boolean> => {
    try {
        const contractsResponse = await getContracts({ estado: 'ACTIVO' });
        return contractsResponse.data.some(contract => contract.inmuebleId === propertyId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const checkTenantHasActiveContract = async (tenantId: string): Promise<boolean> => {
    try {
        const contractsResponse = await getContracts({ estado: 'ACTIVO' });
        return contractsResponse.data.some(contract => contract.inquilinoId === tenantId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}