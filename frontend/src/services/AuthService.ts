import ApiService from './ApiService';
import { ApiResponse } from '../models/types';

/**
 * Auth Service - handles all authentication operations
 * Implements Single Responsibility Principle
 */
export class AuthService {
  private apiService: ApiService;
  private static instance: AuthService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Store auth token
   */
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get stored auth token
   */
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Clear auth token
   */
  public clearToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Check if current token is valid (not expired)
   */
  public isCurrentTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Login user
   */
  public async login(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await this.apiService.post('/api/user/login', { email, password });
      if (response.success && response.data && typeof response.data === 'object' && 'token' in response.data) {
        this.setToken(response.data.token);
        return { success: true, token: response.data.token };
      }
      return { success: false, error: response.message || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  /**
   * Register user
   */
  public async register(name: string, email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await this.apiService.post('/api/user/register', { name, email, password });
      if (response.success && response.data && typeof response.data === 'object' && 'token' in response.data) {
        this.setToken(response.data.token);
        return { success: true, token: response.data.token };
      }
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    this.clearToken();
  }
}
