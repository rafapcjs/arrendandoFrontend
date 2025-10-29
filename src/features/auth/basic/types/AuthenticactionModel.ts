
export interface LoginDto {
    email: string;
    password: string;
}



export interface RecoverPass {
    email: string;
   
}
export interface CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "ADMIN";
}

export interface UserProfile {
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

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthResponse {
    access_token: string;
    user: UserProfile;
}