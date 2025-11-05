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
        if (page !== undefined) params.append('page', page.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        
        const queryString = params.toString();
        const url = queryString ? `/properties?${queryString}` : '/properties';
        
        const { data } = await ApiIntance.get<PropertiesResponse>(url);
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
        if (searchParams.search?.trim()) params.append('search', searchParams.search.trim());
        if (searchParams.disponible !== undefined) params.append('disponible', searchParams.disponible.toString());
        if (searchParams.page !== undefined) params.append('page', searchParams.page.toString());
        if (searchParams.limit !== undefined) params.append('limit', searchParams.limit.toString());
        
        const queryString = params.toString();
        // If no search criteria, use regular properties endpoint instead of search
        if (!searchParams.search?.trim() && searchParams.disponible === undefined) {
            return getProperties(searchParams.page, searchParams.limit);
        }
        
        const url = queryString ? `/properties/search?${queryString}` : '/properties/search';
        
        const { data } = await ApiIntance.get<PropertiesResponse>(url);
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