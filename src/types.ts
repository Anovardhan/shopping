export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discount_price: number;
  stock: number;
  tax?: number;
  rating: number;
  brand: string;
  created_at: string;
  reviews?: Review[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  isAdmin?: boolean;
}

export interface CartItemType {
  product: Product;
  quantity: number;
}

export interface OrderItemType {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface OrderCustomerDetails {
  fullname: string;
  email: string;
  phone: string;
  address: string;
   शहर?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderType {
  id: string;
  user_id: string;
  total_amount: number;
  order_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  items: OrderItemType[];
  customer_details?: OrderCustomerDetails;
}
