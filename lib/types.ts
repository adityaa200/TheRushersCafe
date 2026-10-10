export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  latitude: string;
  longitude: string;
  opening_hours: { day: string; hours: string }[];
  instagram: string;
  google_review_url: string;
  hero_image: string;
  logo_url: string;
  price_range: string;
}

export interface SeoSettings {
  id: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  canonical_url: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  category_name: string;
  image: string;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_bestseller: boolean;
  is_available: boolean;
  sort_order: number;
}

export interface Reservation {
  id: string;
  reservation_id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  special_request: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  notes: string;
  created_at: string;
  payment_status?: string;
  payment_id?: string | null;
  razorpay_order_id?: string | null;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  valid_from: string;
  valid_until: string;
  terms: string;
  is_active: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  sort_order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  photo: string;
  is_featured: boolean;
  sort_order: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
