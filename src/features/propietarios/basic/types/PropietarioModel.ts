export interface Propietario {
    id: string;
    inmobiliariaId: string;
    nombre: string;
    documento: string;
    telefono: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePropietarioDto {
    inmobiliariaId?: string;
    nombre: string;
    documento: string;
    telefono: string;
    email: string;
}

export interface UpdatePropietarioDto {
    nombre?: string;
    documento?: string;
    telefono?: string;
    email?: string;
}

export interface ActivatePropietarioDto {
    isActive: boolean;
}
