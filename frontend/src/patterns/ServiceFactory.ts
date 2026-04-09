import { FoodService } from '../services/FoodService';
import { CartService } from '../services/CartService';
import { AuthService } from '../services/AuthService';
import { OrderService } from '../services/OrderService';

/**
 * Service Factory implementing Factory Pattern
 * Creates and manages service instances
 */
export class ServiceFactory {
  private static instance: ServiceFactory;
  
  private constructor() {
    // Initialize services
  }
  
  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public createFoodService(): FoodService {
    return new FoodService();
  }
  
  public createCartService(): CartService {
    return new CartService();
  }

  public createAuthService(): AuthService {
    return AuthService.getInstance();
  }

  public createOrderService(): OrderService {
    return new OrderService();
  }
}
