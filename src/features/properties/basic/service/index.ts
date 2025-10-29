import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    Property,
    PropertiesResponse,
    CreatePropertyDto,
    UpdatePropertyDto,
    ActivatePropertyDto,
    PropertySearchParams
} from "../types/PropertyModel";

export const getProperties = async (page?: number, limit?: number): Promise<PropertiesResponse> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const { data } = await ApiIntance.get<PropertiesResponse>(`/properties?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getPropertyById = async (id: string): Promise<Property> => {
    try {
        const { data } = await ApiIntance.get<Property>(`/properties/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createProperty = async (propertyData: CreatePropertyDto): Promise<Property> => {
    try {
        const { data } = await ApiIntance.post<Property>("/properties", propertyData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateProperty = async (id: string, updateData: UpdatePropertyDto): Promise<Property> => {
    try {
        const { data } = await ApiIntance.patch<Property>(`/properties/${id}`, updateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteProperty = async (id: string): Promise<void> => {
    try {
        await ApiIntance.delete(`/properties/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchProperties = async (searchParams: PropertySearchParams): Promise<PropertiesResponse> => {
    try {
        const params = new URLSearchParams();
        if (searchParams.search) params.append('search', searchParams.search);
        if (searchParams.disponible !== undefined) params.append('disponible', searchParams.disponible.toString());
        if (searchParams.page) params.append('page', searchParams.page.toString());
        if (searchParams.limit) params.append('limit', searchParams.limit.toString());
        
        const { data } = await ApiIntance.get<PropertiesResponse>(`/properties/search?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchPropertiesByAddress = async (direccion: string): Promise<PropertiesResponse> => {
    try {
        const { data } = await ApiIntance.get<PropertiesResponse>(`/properties/address/${encodeURIComponent(direccion)}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const activateProperty = async (id: string, activateData: ActivatePropertyDto): Promise<Property> => {
    try {
        const { data } = await ApiIntance.patch<Property>(`/properties/${id}/activate`, activateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}