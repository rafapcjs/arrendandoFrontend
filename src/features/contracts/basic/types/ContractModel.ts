export type ContratoEstado = 'BORRADOR' | 'ACTIVO' | 'PROXIMO_VENCER' | 'VENCIDO' | 'FINALIZADO';

export interface Inquilino {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono?: string;
}

export interface Inmueble {
    id: string;
    direccion: string;
    descripcion?: string;
}

export interface Contract {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    canonMensual: number;
    estado: ContratoEstado;
    inquilinoId: string;
    inmuebleId: string;
    inquilino: Inquilino;
    inmueble: Inmueble;
    createdAt: string;
    updatedAt: string;
}

export interface ContractsResponse {
    data: Contract[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateContractDto {
    fechaInicio: string;
    fechaFin: string;
    canonMensual: number;
    estado: ContratoEstado;
    inquilinoId: string;
    inmuebleId: string;
}

export interface UpdateContractDto {
    fechaInicio?: string;
    fechaFin?: string;
    canonMensual?: number;
    estado?: ContratoEstado;
    inquilinoId?: string;
    inmuebleId?: string;
}

export interface ContractSearchParams {
    page?: number;
    limit?: number;
    estado?: ContratoEstado;
}

export interface ActiveContract {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    canonMensual: number;
    estado: ContratoEstado;
    inquilino: {
        nombres: string;
        apellidos: string;
    };
    inmueble: {
        direccion: string;
    };
}

export interface ExpiringContract {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    canonMensual: number;
    estado: ContratoEstado;
    inquilino: {
        nombres: string;
        apellidos: string;
    };
    inmueble: {
        direccion: string;
    };
}