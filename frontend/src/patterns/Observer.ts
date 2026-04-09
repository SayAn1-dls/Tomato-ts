/**
 * Observer Pattern Implementation
 * Defines the generic observer interface and concrete implementations
 */

// Generic Observer Interface
export interface IObserver<T> {
  update(event: T): void;
}

// Generic Subject Interface
export interface ISubject<T> {
  observers: IObserver<T>[];
  subscribe(observer: IObserver<T>): void;
  unsubscribe(observer: IObserver<T>): void;
  notify(event: T): void;
}

// Concrete Subject Implementation
export class Subject<T> implements ISubject<T> {
  public observers: IObserver<T>[] = [];

  subscribe(observer: IObserver<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver<T>): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(event: T): void {
    this.observers.forEach(observer => observer.update(event));
  }
}

// Event Types
export interface CartEvent {
  type: 'CART_ITEM_ADDED' | 'CART_ITEM_REMOVED';
  itemId: string;
}

export interface UserEvent {
  type: 'USER_LOGIN' | 'USER_LOGOUT';
  user?: string;
  email?: string;
}

export interface FoodEvent {
  type: 'FOOD_ADDED' | 'FOOD_UPDATED' | 'FOOD_REMOVED';
  foodId: string;
}

export interface OrderEvent {
  type: 'ORDER_PLACED' | 'ORDER_UPDATED' | 'ORDER_CANCELLED';
  orderId: string;
}
