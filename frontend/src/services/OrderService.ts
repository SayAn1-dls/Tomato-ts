import ApiService from './ApiService';
import { ApiResponse } from '../models/types';

/**
 * Order Service - handles all order-related operations
 * Implements Single Responsibility Principle
 */
export class OrderService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  /**
   * Place new order
   */
  async placeOrder(orderData: any): Promise<{ success: boolean; sessionUrl?: string; error?: string }> {
    try {
      const response = await this.apiService.post('/api/order/place', orderData);
      if (response.success) {
        return { success: true, sessionUrl: response.data?.session_url };
      }
      return { success: false, error: response.message || 'Failed to place order' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to place order' };
    }
  }

  /**
   * Place COD order
   */
  async placeOrderCOD(orderData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.apiService.post('/api/order/placecod', orderData);
      if (response.success) {
        return { success: true };
      }
      return { success: false, error: response.message || 'Failed to place COD order' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to place COD order' };
    }
  }

  /**
   * Verify order payment
   */
  async verifyOrder(orderId: string, success: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.apiService.post('/api/order/verify', { orderId, success });
      if (response.success) {
        return { success: true };
      }
      return { success: false, error: response.message || 'Failed to verify order' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to verify order' };
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await this.apiService.post('/api/order/userorders', {});
      if (response.success && response.data) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message || 'Failed to get user orders' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get user orders' };
    }
  }
}
