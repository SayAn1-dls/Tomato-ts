import ApiService from './ApiService';
import { FoodItem, ApiResponse } from '../models/types';

/**
 * Food Service - handles all food-related API operations
 * Implements Single Responsibility Principle
 */
export class FoodService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  /**
   * Fetch all available food items
   */
  async getAllFoods(): Promise<FoodItem[]> {
    const response = await this.apiService.get<FoodItem[]>('/api/food/list');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch food items');
  }

  /**
   * Get food items by category
   */
  async getFoodsByCategory(category: string): Promise<FoodItem[]> {
    const allFoods = await this.getAllFoods();
    return allFoods.filter(food => food.category === category);
  }

  /**
   * Get food item by ID
   */
  async getFoodById(id: string): Promise<FoodItem | null> {
    const allFoods = await this.getAllFoods();
    return allFoods.find(food => food._id === id) || null;
  }

  /**
   * Search food items by name
   */
  async searchFoods(query: string): Promise<FoodItem[]> {
    const allFoods = await this.getAllFoods();
    return allFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get food statistics
   */
  async getFoodStats(): Promise<{
    totalItems: number;
    categoriesCount: { [key: string]: number };
  }> {
    const allFoods = await this.getAllFoods();
    const categoriesCount: { [key: string]: number } = {};
    
    allFoods.forEach(food => {
      categoriesCount[food.category] = (categoriesCount[food.category] || 0) + 1;
    });

    return {
      totalItems: allFoods.length,
      categoriesCount
    };
  }
}

export default FoodService;
