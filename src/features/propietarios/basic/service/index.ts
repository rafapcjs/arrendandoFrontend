import { ApiIntance } from "../../../../infrastructure/api";
import type {
    Propietario,
    CreatePropietarioDto,
    UpdatePropietarioDto,
    ActivatePropietarioDto,
} from "../types/PropietarioModel";

export const getPropietarios = async (): Promise<Propietario[]> => {
    try {
        const { data } = await ApiIntance.get<Propietario[]>('/propietarios');
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPropietarioById = async (id: string): Promise<Propietario> => {
    try {
        const { data } = await ApiIntance.get<Propietario>(`/propietarios/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPropietario = async (propietarioData: CreatePropietarioDto): Promise<Propietario> => {
    try {
        const { data } = await ApiIntance.post<Propietario>('/propietarios', propietarioData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePropietario = async (id: string, updateData: UpdatePropietarioDto): Promise<Propietario> => {
    try {
        const { data } = await ApiIntance.patch<Propietario>(`/propietarios/${id}`, updateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const activatePropietario = async (id: string, activateData: ActivatePropietarioDto): Promise<Propietario> => {
    try {
        const { data } = await ApiIntance.patch<Propietario>(`/propietarios/${id}/activate`, activateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePropietario = async (id: string): Promise<void> => {
    try {
        await ApiIntance.delete(`/propietarios/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
