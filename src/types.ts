export interface Product {
  id: number;
  product_name: string;
  price: number;
  condition: 'New' | 'Preloved';
  category: 'Bags' | 'Footwear';
  size?: string;
  is_curated: number; // 0 or 1
  description: string;
  product_id: string;
  images: string[];
  is_active: number;
  created_at: string;
}

export interface Settings {
  store_name: string;
  whatsapp_number: string;
  email: string;
  location: string;
}
