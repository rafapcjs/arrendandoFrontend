export type InmobiliariaEstado = 'ACTIVA' | 'INACTIVA';

export interface InmobiliariaDisponible {
    id: string;
    nombre: string;
    nit: string;
    estado: InmobiliariaEstado;
}

export interface Inmobiliaria {
    id: string;
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: InmobiliariaEstado;
    creadoPorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInmobiliariaDto {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    estado?: InmobiliariaEstado;
}

export interface UpdateInmobiliariaDto {
    nombre?: string;
    nit?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    estado?: InmobiliariaEstado;
}
