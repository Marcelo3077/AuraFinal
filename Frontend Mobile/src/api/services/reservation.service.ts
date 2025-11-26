import api from '../axios.config';
import { Reservation, PaginatedResponse } from '@/types';

export const reservationService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get<PaginatedResponse<Reservation>>('/reservations', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Reservation>(`/reservations/${id}`);
        return response.data;
    },

    getMyReservations: async (page = 0, size = 10) => {
        const response = await api.get<PaginatedResponse<Reservation>>('/reservations/my', {
            params: { page, size },
        });
        return response.data;
    },

    create: async (reservationData: Partial<Reservation>) => {
        const response = await api.post<Reservation>('/reservations', reservationData);
        return response.data;
    },

    update: async (id: number, reservationData: Partial<Reservation>) => {
        const response = await api.put<Reservation>(`/reservations/${id}`, reservationData);
        return response.data;
    },

    cancel: async (id: number) => {
        const response = await api.patch(`/reservations/${id}/cancel`);
        return response.data;
    },

    complete: async (id: number) => {
        const response = await api.patch(`/reservations/${id}/complete`);
        return response.data;
    },
};
