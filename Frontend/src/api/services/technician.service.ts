import { ApiClient } from '../axios.config';
import { Technician, PaginatedResponse } from '../../types';

export class TechnicianService {
  private static BASE = '/technicians';

  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    return ApiClient.get<PaginatedResponse<Technician>>(this.BASE, {
      params: { page, size }
    });
  }

  static async getById(id: number): Promise<Technician> {
    return ApiClient.get<Technician>(`${this.BASE}/${id}`);
  }

  static async update(id: number, data: Partial<Technician>): Promise<Technician> {
    return ApiClient.put<Technician>(`${this.BASE}/${id}`, data);
  }

  static async search(query: string, page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    return ApiClient.get<PaginatedResponse<Technician>>(`${this.BASE}/search`, {
      params: { query, page, size }
    });
  }

  static async getByService(serviceId: number, page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    const response = await ApiClient.get<PaginatedResponse<Technician> | Technician[]>(`${this.BASE}/service/${serviceId}`, {
      params: { page, size }
    });

    if (Array.isArray(response)) {
      const content = response;
      return {
        content,
        totalElements: content.length,
        totalPages: 1,
        size: content.length,
        number: 0,
        first: true,
        last: true,
      };
    }

    return response;
  }

  static async getAvailable(page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    return ApiClient.get<PaginatedResponse<Technician>>(`${this.BASE}/available`, {
      params: { page, size }
    });
  }
}
