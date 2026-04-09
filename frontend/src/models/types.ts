// Food Item Interface
export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Cart Item Type
export interface CartItem {
  [key: string]: number;
}

// Menu Item Interface
export interface MenuItem {
  _id: string;
  menu_name: string;
  menu_image: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Component Props Types
export interface FoodItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface NavbarProps {
  setShowLogin: (show: boolean) => void;
}

export interface LoginPopupProps {
  setShowLogin: (show: boolean) => void;
}

export interface FoodDisplayProps {
  category: string;
}

export interface ExploreMenuProps {
  category: string;
  setCategory: (category: string) => void;
}

// Form Types
export interface LoginFormData {
  name: string;
  email: string;
  password: string;
}

// Context Types
export interface StoreContextType {
  url: string;
  food_list: FoodItem[];
  menu_list: MenuItem[];
  cartItems: CartItem;
  addToCart: (itemId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  getTotalCartAmount: () => number;
  token: string;
  setToken: (token: string) => void;
  loadCartData: (token: string) => Promise<void>;
  setCartItems: (items: CartItem) => void;
  currency: string;
  deliveryCharge: number;
  fetchFoodList: () => Promise<void>;
}
