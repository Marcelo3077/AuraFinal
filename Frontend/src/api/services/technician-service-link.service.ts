import { ApiClient } from '../axios.config';
import { PaginatedResponse, TechnicianServiceLink } from '../../types';

export class TechnicianServiceLinkService {
  private static BASE = '/technician-services';

  static async create(data: {
    technicianId: number;
    serviceId: number;
    baseRate: number;
  }): Promise<TechnicianServiceLink> {
    return ApiClient.post<TechnicianServiceLink>(this.BASE, data);
  }

  static async getByTechnician(technicianId: number): Promise<TechnicianServiceLink[]> {
    const response = await ApiClient.get<
      PaginatedResponse<TechnicianServiceLink> | TechnicianServiceLink[]
    >(`${this.BASE}/technician/${technicianId}`);

    if (Array.isArray(response)) {
      return response;
    }

    return response.content ?? [];
  }

  static async getByService(serviceId: number): Promise<TechnicianServiceLink[]> {
    const response = await ApiClient.get<
      PaginatedResponse<TechnicianServiceLink> | TechnicianServiceLink[]
    >(`${this.BASE}/service/${serviceId}`);

    if (Array.isArray(response)) {
      return response;
    }

    return response.content ?? [];
  }

  static async updateBaseRate(
    technicianId: number,
    serviceId: number,
    baseRate: number
  ): Promise<TechnicianServiceLink> {
    return ApiClient.patch<TechnicianServiceLink>(
      `${this.BASE}/${technicianId}/${serviceId}/base-rate`,
      undefined,
      { params: { baseRate } }
    );
  }
}
