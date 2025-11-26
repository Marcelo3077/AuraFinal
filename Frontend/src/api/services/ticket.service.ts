import { ApiClient } from '../axios.config';
import { SupportTicket, CreateTicketRequest, PaginatedResponse, TicketStatus } from '../../types';

export class TicketService {
  private static BASE = '/tickets';

  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<SupportTicket>> {
    return ApiClient.get<PaginatedResponse<SupportTicket>>(this.BASE, {
      params: { page, size }
    });
  }

  static async getById(id: number): Promise<SupportTicket> {
    return ApiClient.get<SupportTicket>(`${this.BASE}/${id}`);
  }

  static async getMy(page = 0, size = 10): Promise<PaginatedResponse<SupportTicket>> {
    return ApiClient.get<PaginatedResponse<SupportTicket>>(`${this.BASE}/my`, {
      params: { page, size }
    });
  }

  static async getByStatus(status: TicketStatus, page = 0, size = 10): Promise<PaginatedResponse<SupportTicket>> {
    return ApiClient.get<PaginatedResponse<SupportTicket>>(`${this.BASE}/status/${status}`, {
      params: { page, size }
    });
  }

  static async create(data: CreateTicketRequest): Promise<SupportTicket> {
    return ApiClient.post<SupportTicket>(this.BASE, data);
  }

  static async updateStatus(id: number, status: TicketStatus): Promise<SupportTicket> {
    return ApiClient.patch<SupportTicket>(`${this.BASE}/${id}/status`, { status });
  }

  static async assign(id: number, adminId: number): Promise<SupportTicket> {
    return ApiClient.patch<SupportTicket>(`${this.BASE}/${id}/assign`, { adminId });
  }

  static async close(id: number): Promise<SupportTicket> {
    return ApiClient.patch<SupportTicket>(`${this.BASE}/${id}/close`);
  }
}
