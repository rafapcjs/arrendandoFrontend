import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    CreateAdminDto, 
    LoginDto, 
    UserProfile, 
    UsersResponse, 
    User, 
    UpdateUserDto, 
    ActivateUserDto,
    AuthResponse, 
    RecoverPass,
    ChangePasswordDto
} from "../types/AuthenticactionModel";

export const Login = async (dataLogin: LoginDto): Promise<AuthResponse> => {
    try {
        const { data } = await ApiIntance.post<AuthResponse>("/auth/login", dataLogin);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const Signup = async (dataCreateUser: CreateAdminDto): Promise<AuthResponse> => {
    try {
        const { data } = await ApiIntance.post<AuthResponse>("/auth/register", dataCreateUser);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const RecoverPassword = async (dataRecoverPassword: RecoverPass): Promise<AuthResponse> => {
    try {
        const { data } = await ApiIntance.post<AuthResponse>("/auth/recover-password", dataRecoverPassword);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const getProfile = async (): Promise<UserProfile> => {
    try {
        const { data } = await ApiIntance.get<UserProfile>("/auth/profile");
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

export const changePassword = async (changePasswordData: ChangePasswordDto): Promise<void> => {
    try {
        await ApiIntance.patch("/auth/change-password", changePasswordData);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const Logout = async (): Promise<void> => {
    try {
        await ApiIntance.post("/auth/logout");
    } catch (error) {
        console.error(error);
        throw error;
    }
}