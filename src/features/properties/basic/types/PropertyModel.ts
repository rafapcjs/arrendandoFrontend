export interface Property {
    id: string;
    direccion: string;
    codigoServicioAgua: string;
    codigoServicioGas: string;
    codigoServicioLuz: string;
    disponible: boolean;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
}

export interface PropertiesResponse {
    data: Property[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreatePropertyDto {
    direccion: string;
    codigoServicioAgua: string;
    codigoServicioGas: string;
    codigoServicioLuz: string;
    disponible?: boolean;
    descripcion?: string;
}

export interface UpdatePropertyDto {
    direccion?: string;
    codigoServicioAgua?: string;
    codigoServicioGas?: string;
    codigoServicioLuz?: string;
    disponible?: boolean;
    descripcion?: string;
}

export interface ActivatePropertyDto {
    disponible: boolean;
}

export interface PropertySearchParams {
    search?: string;
    disponible?: boolean;
    page?: number;
    limit?: number;
}