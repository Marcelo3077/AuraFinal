import { ApiClient } from '../axios.config';
import { Payment, CreatePaymentRequest, PaginatedResponse } from '../../types';

export class PaymentService {
  private static BASE = '/payments';

  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<Payment>> {
    return ApiClient.get<PaginatedResponse<Payment>>(this.BASE, {
      params: { page, size }
    });
  }

  static async getById(id: number): Promise<Payment> {
    return ApiClient.get<Payment>(`${this.BASE}/${id}`);
  }

  static async getMy(page = 0, size = 10): Promise<PaginatedResponse<Payment>> {
    return ApiClient.get<PaginatedResponse<Payment>>(`${this.BASE}/my`, {
      params: { page, size }
    });
  }

  static async create(data: CreatePaymentRequest): Promise<Payment> {
    return ApiClient.post<Payment>(this.BASE, data);
  }

  static async process(id: number): Promise<Payment> {
    return ApiClient.patch<Payment>(`${this.BASE}/${id}/process`);
  }

  static async refund(id: number): Promise<Payment> {
    return ApiClient.patch<Payment>(`${this.BASE}/${id}/refund`);
  }
}
