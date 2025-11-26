import { ApiClient } from '../axios.config';
import { Reservation, CreateReservationRequest, PaginatedResponse, ReservationStatus } from '../../types';

export class ReservationService {
  private static BASE = '/reservations';

  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<Reservation>> {
    return ApiClient.get<PaginatedResponse<Reservation>>(this.BASE, {
      params: { page, size }
    });
  }

  static async getById(id: number): Promise<Reservation> {
    return ApiClient.get<Reservation>(`${this.BASE}/${id}`);
  }

  static async getMy(page = 0, size = 10): Promise<PaginatedResponse<Reservation>> {
    return ApiClient.get<PaginatedResponse<Reservation>>(`${this.BASE}/my`, {
      params: { page, size }
    });
  }

  static async getMyAsTechnician(page = 0, size = 10): Promise<PaginatedResponse<Reservation>> {
    return ApiClient.get<PaginatedResponse<Reservation>>(`${this.BASE}/my/technician`, {
      params: { page, size }
    });
  }

  static async getByStatus(status: ReservationStatus, page = 0, size = 10): Promise<PaginatedResponse<Reservation>> {
    return ApiClient.get<PaginatedResponse<Reservation>>(`${this.BASE}/status/${status}`, {
      params: { page, size }
    });
  }

  static async create(data: CreateReservationRequest): Promise<Reservation> {
    return ApiClient.post<Reservation>(this.BASE, data);
  }

  static async confirm(id: number): Promise<Reservation> {
    return ApiClient.patch<Reservation>(`${this.BASE}/${id}/confirm`);
  }

  static async reject(id: number): Promise<Reservation> {
    return ApiClient.patch<Reservation>(`${this.BASE}/${id}/reject`);
  }

  static async cancel(id: number, reason?: string): Promise<Reservation> {
    return ApiClient.patch<Reservation>(`${this.BASE}/${id}/cancel`, { reason });
  }

  static async complete(id: number): Promise<Reservation> {
    return ApiClient.patch<Reservation>(`${this.BASE}/${id}/complete`);
  }
}
