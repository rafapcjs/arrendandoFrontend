import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    Tenant,
    TenantsResponse,
    CreateTenantDto,
    UpdateTenantDto,
    ActivateTenantDto,
    TenantSearchParams
} from "../types/TenantModel";

export const createTenant = async (tenantData: CreateTenantDto): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.post<Tenant>("/tenants", tenantData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getTenants = async (page?: number, limit?: number): Promise<TenantsResponse> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const { data } = await ApiIntance.get<TenantsResponse>(`/tenants?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchTenants = async (searchParams: TenantSearchParams): Promise<TenantsResponse> => {
    try {
        const params = new URLSearchParams();
        if (searchParams.search) params.append('search', searchParams.search);
        if (searchParams.ciudad) params.append('ciudad', searchParams.ciudad);
        if (searchParams.isActive !== undefined) params.append('isActive', searchParams.isActive.toString());
        if (searchParams.page) params.append('page', searchParams.page.toString());
        if (searchParams.limit) params.append('limit', searchParams.limit.toString());
        
        const { data } = await ApiIntance.get<TenantsResponse>(`/tenants/search?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getTenantByCedula = async (cedula: string): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.get<Tenant>(`/tenants/cedula/${cedula}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getTenantByEmail = async (correo: string): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.get<Tenant>(`/tenants/email/${correo}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getTenantById = async (id: string): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.get<Tenant>(`/tenants/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateTenant = async (id: string, updateData: UpdateTenantDto): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.patch<Tenant>(`/tenants/${id}`, updateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const activateTenant = async (id: string, activateData: ActivateTenantDto): Promise<Tenant> => {
    try {
        const { data } = await ApiIntance.patch<Tenant>(`/tenants/${id}/activate`, activateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteTenant = async (id: string): Promise<void> => {
    try {
        await ApiIntance.delete(`/tenants/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}