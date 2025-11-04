export interface AdminProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface ActivateUserDto {
    isActive: boolean;
}