
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_screenshot_url: string | null;
  delivery_address: any;
  phone: string;
  shipping_status: string;
  courier_name: string;
  courier_contact: string;
  tracking_id: string;
  created_at: string;
  user_profile: {
    email: string;
    full_name: string;
  } | null;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    } | null;
  }[];
}

export interface EditingOrder {
  id: string;
  status: string;
  shipping_status: string;
  courier_name: string;
  courier_contact: string;
  tracking_id: string;
}
