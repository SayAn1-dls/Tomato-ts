import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { menu_list } from '../assets/assets';
import { StoreContextType, FoodItem, CartItem } from '../models/types';
import { FoodService } from '../services/FoodService';
import { CartService } from '../services/CartService';
import { AuthService } from '../services/AuthService';
import { Subject, IObserver } from '../patterns/Observer';
import type { CartEvent, UserEvent } from '../patterns/Observer';

export const StoreContext = createContext<StoreContextType | null>(null);

interface StoreContextProviderProps {
  children: ReactNode;
}

const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ children }) => {
  const url = "http://localhost:5002";
  const [food_list, setFoodList] = useState<FoodItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem>({});
  const [token, setToken] = useState<string>("");
  const currency = "₹";
  const deliveryCharge = 50;

  const foodService = new FoodService();
  const cartService = new CartService();
  const authService = AuthService.getInstance();
  
  // Create event subjects
  const cartSubject = new Subject<CartEvent>();
  const userSubject = new Subject<UserEvent>();

  // Cart Observer - handles cart-related events
  const cartObserver: IObserver<CartEvent> = {
    update: (event: CartEvent) => {
      console.log('Cart event:', event);
      // Handle cart events (e.g., update UI, send analytics)
    }
  };

  // User Observer - handles user-related events
  const userObserver: IObserver<UserEvent> = {
    update: (event: UserEvent) => {
      console.log('User event:', event);
      // Handle user events (e.g., update UI, send analytics)
    }
  };

  useEffect(() => {
    // Subscribe to events
    cartSubject.subscribe(cartObserver);
    userSubject.subscribe(userObserver);

    // Initialize data
    initializeData();

    // Cleanup on unmount
    return () => {
      cartSubject.unsubscribe(cartObserver);
      userSubject.unsubscribe(userObserver);
    };
  }, []);

  const initializeData = async () => {
    try {
      await fetchFoodList();
      const storedToken = authService.getToken();
      if (storedToken && authService.isCurrentTokenValid()) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    } catch (error) {
      console.error('Failed to initialize store:', error);
    }
  };

  const addToCart = async (itemId: string): Promise<void> => {
    try {
      // Update local state immediately for better UX
      const newCartItems = { ...cartItems };
      if (!newCartItems[itemId]) {
        newCartItems[itemId] = 1;
      } else {
        newCartItems[itemId] += 1;
      }
      setCartItems(newCartItems);

      // Update backend
      await cartService.addToCart(itemId);
      
      // Notify cart event
      cartSubject.notify({
        type: 'CART_ITEM_ADDED',
        itemId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Revert local state on error
      const revertedCartItems = { ...cartItems };
      if (revertedCartItems[itemId] > 1) {
        revertedCartItems[itemId] -= 1;
      } else {
        delete revertedCartItems[itemId];
      }
      setCartItems(revertedCartItems);
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    try {
      // Update local state immediately for better UX
      const newCartItems = { ...cartItems };
      if (newCartItems[itemId] > 0) {
        newCartItems[itemId] -= 1;
      }
      if (newCartItems[itemId] === 0) {
        delete newCartItems[itemId];
      }
      setCartItems(newCartItems);

      // Update backend
      await cartService.removeFromCart(itemId);
      
      // Notify cart event
      cartSubject.notify({
        type: 'CART_ITEM_REMOVED',
        itemId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Revert local state on error
      const revertedCartItems = { ...cartItems };
      revertedCartItems[itemId] = (revertedCartItems[itemId] || 0) + 1;
      setCartItems(revertedCartItems);
    }
  };

  const getTotalCartAmount = (): number => {
    return cartService.calculateTotalAmount(cartItems, food_list);
  };

  const fetchFoodList = async (): Promise<void> => {
    try {
      const foods = await foodService.getAllFoods();
      console.log('Fetched foods from API:', foods.length, 'items');
      setFoodList(foods);
    } catch (error) {
      console.error('Failed to fetch food list:', error);
      // Don't fallback to static data - show error instead
      setFoodList([]);
    }
  };

  const loadCartData = async (authToken: string): Promise<void> => {
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData);
    } catch (error) {
      console.error('Failed to load cart data:', error);
    }
  };

  const handleSetToken = (newToken: string): void => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      // Notify user login event
      userSubject.notify({
        type: 'USER_LOGIN',
        user: '',
        email: '',
        timestamp: new Date()
      });
    } else {
      localStorage.removeItem("token");
      setCartItems({});
      // Notify user logout event
      userSubject.notify({
        type: 'USER_LOGOUT',
        user: '',
        email: '',
        timestamp: new Date()
      });
    }
  };

  const contextValue: StoreContextType = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken: handleSetToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
    fetchFoodList
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
