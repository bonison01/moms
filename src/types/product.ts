
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  offer_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  category: string | null;
  features: string[] | null;
  ingredients: string | null;
  offers: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
}
