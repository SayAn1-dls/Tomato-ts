import ApiService from './ApiService';
import { CartItem, ApiResponse } from '../models/types';

/**
 * Cart Service - handles all cart-related operations
 * Implements Single Responsibility Principle
 */
export class CartService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  /**
   * Add item to cart
   */
  async addToCart(itemId: string): Promise<void> {
    const response = await this.apiService.post('/api/cart/add', { itemId });
    if (response.success) {
      return;
    }
    throw new Error(response.message || 'Failed to add to cart');
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<void> {
    const response = await this.apiService.post('/api/cart/remove', { itemId });
    if (response.success) {
      return;
    }
    throw new Error(response.message || 'Failed to remove from cart');
  }

  /**
   * Get cart items
   */
  async getCart(): Promise<CartItem> {
    const response = await this.apiService.get('/api/cart/get', {});
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get cart');
  }

  /**
   * Calculate total cart amount
   */
  calculateTotalAmount(cartItems: CartItem, foodList: any[]): number {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = foodList.find((item: any) => item._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  }
}
