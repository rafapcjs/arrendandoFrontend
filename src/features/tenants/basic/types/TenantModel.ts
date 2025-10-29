export interface Tenant {
    id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    correo: string;
    direccion: string;
    ciudad: string;
    contactoEmergencia: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TenantsResponse {
    data: Tenant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateTenantDto {
    cedula: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    correo: string;
    direccion: string;
    ciudad: string;
    contactoEmergencia: string;
    isActive?: boolean;
}

export interface UpdateTenantDto {
    cedula?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    ciudad?: string;
    contactoEmergencia?: string;
    isActive?: boolean;
}

export interface ActivateTenantDto {
    isActive: boolean;
}

export interface TenantSearchParams {
    search?: string;
    ciudad?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}