import { ApiClient } from '../axios.config';
import { Review, CreateReviewRequest, PaginatedResponse } from '../../types';

export class ReviewService {
  private static BASE = '/reviews';

  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    const { data } = await ApiClient.get<Review[]>(this.BASE, {
      params: { page, size }
    });

    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length
    } as PaginatedResponse<Review>;
  }

  static async getById(id: number): Promise<Review> {
    return ApiClient.get<Review>(`${this.BASE}/${id}`);
  }

  static async getMy(page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    return ApiClient.get<PaginatedResponse<Review>>(`${this.BASE}/my`, {
      params: { page, size }
    });
  }

  static async getByTechnician(technicianId: number, page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    const { data } = await ApiClient.get<Review[]>(`${this.BASE}/technician/${technicianId}`, {
      params: { page, size }
    });

    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length
    } as PaginatedResponse<Review>;
  }

  static async getByUser(userId: number, page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    const { data } = await ApiClient.get<Review[]>(`${this.BASE}/user/${userId}`, {
      params: { page, size }
    });

    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length
    } as PaginatedResponse<Review>;
  }

  static async create(data: CreateReviewRequest): Promise<Review> {
    return ApiClient.post<Review>(this.BASE, data);
  }

  static async delete(id: number): Promise<void> {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
}
