import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    AdminProfile, 
    UsersResponse, 
    User, 
    UpdateUserDto, 
    ActivateUserDto 
} from "../types/AdminModel";

export const getAdminProfile = async (): Promise<AdminProfile> => {
    try {
        const { data } = await ApiIntance.get<AdminProfile>("/auth/profile");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUsers = async (page?: number, limit?: number): Promise<UsersResponse> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const { data } = await ApiIntance.get<UsersResponse>(`/auth/users?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserById = async (id: string): Promise<User> => {
    try {
        const { data } = await ApiIntance.get<User>(`/auth/users/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateUser = async (id: string, updateData: UpdateUserDto): Promise<User> => {
    try {
        const { data } = await ApiIntance.patch<User>(`/auth/users/${id}`, updateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const activateUser = async (id: string, activateData: ActivateUserDto): Promise<User> => {
    try {
        const { data } = await ApiIntance.patch<User>(`/auth/users/${id}/activate`, activateData);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await ApiIntance.delete(`/auth/users/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}