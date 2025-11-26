import api from '../axios.config';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (userData: Partial<RegisterRequest>) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        const response = await api.post('/auth/change-password', {
            oldPassword,
            newPassword,
        });
        return response.data;
    },
};
