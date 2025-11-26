import { ApiClient } from '../axios.config';
import { LoginRequest, LoginResponse, RegisterUserRequest } from '../../types';

export class AuthService {
  private static BASE = '/auth';

  static async login(data: LoginRequest): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>(`${this.BASE}/login`, data);
  }

  static async register(data: RegisterUserRequest): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>(`${this.BASE}/register`, data);
  }

  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>(`${this.BASE}/refresh`, { refreshToken });
  }

  static async logout(): Promise<void> {
    return ApiClient.post<void>(`${this.BASE}/logout`);
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(`${this.BASE}/forgot-password`, { email });
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(`${this.BASE}/reset-password`, {
      token,
      newPassword
    });
  }
}
