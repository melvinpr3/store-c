export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  price: number;
  original_price?: number;
  on_sale?: boolean;
  description: string;
  description_it?: string;
  description_en?: string;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  details: string[];
  details_it?: string[];
  details_en?: string[];
  stock?: number;
  is_active?: boolean;
  name_it?: string;
  name_en?: string;
  gender?: string;
  colors?: string[];
  style?: string;
  season?: string;
  visual_description?: string;
  store_id?: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone?: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  address_line: string;
  city: string;
  zip: string;
  province?: string;
  country: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: Address | any;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  brand: string;
  price: number;
  quantity: number;
  size: string;
}
