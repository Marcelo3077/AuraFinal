import api from '../axios.config';
import { Service, PaginatedResponse } from '@/types';

export const serviceService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get<PaginatedResponse<Service>>('/services', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Service>(`/services/${id}`);
        return response.data;
    },

    getByCategory: async (category: string, page = 0, size = 10) => {
        const response = await api.get<PaginatedResponse<Service>>('/services/category/' + category, {
            params: { page, size },
        });
        return response.data;
    },

    create: async (serviceData: Partial<Service>) => {
        const response = await api.post<Service>('/services', serviceData);
        return response.data;
    },

    update: async (id: number, serviceData: Partial<Service>) => {
        const response = await api.put<Service>(`/services/${id}`, serviceData);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },
};
