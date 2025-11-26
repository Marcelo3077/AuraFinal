import { ApiClient } from '../axios.config';
import { User, PaginatedResponse } from '../../types';

export class UserService {
  private static BASE = '/users';
  
  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<User>> {
    return ApiClient.get<PaginatedResponse<User>>(this.BASE, {
      params: { page, size }
    });
  }
  
  static async getById(id: number): Promise<User> {
    return ApiClient.get<User>(`${this.BASE}/${id}`);
  }
  
  static async getCurrent(): Promise<User> {
    return ApiClient.get<User>(`${this.BASE}/me`);
  }
  
  static async update(id: number, data: Partial<User>): Promise<User> {
    return ApiClient.put<User>(`${this.BASE}/${id}`, data);
  }
  
  static async delete(id: number): Promise<void> {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
  
  static async search(query: string, page = 0, size = 10): Promise<PaginatedResponse<User>> {
    return ApiClient.get<PaginatedResponse<User>>(`${this.BASE}/search`, {
      params: { query, page, size }
    });
  }
}
