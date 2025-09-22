// Mock database implementation
// In production, this would connect to a real database like PostgreSQL, MongoDB, etc.

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  paymentMethod: 'btc' | 'venmo' | 'cashapp';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  idType: 'regular' | 'polycard' | 'ny-v4';
  state: string;
  country: string;
  quantity: number;
  price: number;
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    sex: string;
    eyeColor: string;
    hairColor: string;
    height: string;
    dateOfBirth: string;
    weight: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    issueDate: string;
    wearsGlasses: boolean;
    organDonor: boolean;
  };
  uploads: {
    photo?: string;
    signature?: string;
  };
  additionalDuplicates: number;
  pricing: any;
}

export interface CartData {
  userId: string;
  items: any[];
  updatedAt: string;
}

// Mock storage - in production, use a real database
class MockDatabase {
  private orders: Map<string, Order> = new Map();
  private carts: Map<string, CartData> = new Map();

  // Order methods
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const id = 'order_' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    for (const order of this.orders.values()) {
      if (order.orderNumber === orderNumber) {
        return order;
      }
    }
    return null;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
  }

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    
    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
  }

  // Cart methods
  async saveCart(userId: string, items: any[]): Promise<void> {
    const cartData: CartData = {
      userId,
      items,
      updatedAt: new Date().toISOString(),
    };
    this.carts.set(userId, cartData);
  }

  async getCart(userId: string): Promise<any[]> {
    const cartData = this.carts.get(userId);
    return cartData?.items || [];
  }

  async clearCart(userId: string): Promise<void> {
    this.carts.delete(userId);
  }

  // Admin methods
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    const orders = Array.from(this.orders.values());
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'confirmed')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }
}

export const db = new MockDatabase();

// Generate order number
export function generateOrderNumber(): string {
  return 'IF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}