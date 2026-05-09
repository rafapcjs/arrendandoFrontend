import { ApiIntance } from "../../../../infrastructure/api";
import type {
    Inmobiliaria,
    CreateInmobiliariaDto,
    UpdateInmobiliariaDto,
} from "../types/InmobiliariaModel";

export const getInmobiliarias = async (): Promise<Inmobiliaria[]> => {
    try {
        const { data } = await ApiIntance.get<Inmobiliaria[]>('/inmobiliarias');
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getInmobiliariaById = async (id: string): Promise<Inmobiliaria> => {
    try {
        const { data } = await ApiIntance.get<Inmobiliaria>(`/inmobiliarias/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createInmobiliaria = async (inmobiliariaData: CreateInmobiliariaDto): Promise<Inmobiliaria> => {
    try {
        const { data } = await ApiIntance.post<Inmobiliaria>('/inmobiliarias', inmobiliariaData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateInmobiliaria = async (id: string, updateData: UpdateInmobiliariaDto): Promise<Inmobiliaria> => {
    try {
        const { data } = await ApiIntance.patch<Inmobiliaria>(`/inmobiliarias/${id}`, updateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const toggleEstadoInmobiliaria = async (id: string): Promise<Inmobiliaria> => {
    try {
        const { data } = await ApiIntance.patch<Inmobiliaria>(`/inmobiliarias/${id}/toggle-estado`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
