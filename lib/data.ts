'use client';

import { supabase } from './supabase';
import type {
  RestaurantSettings,
  SeoSettings,
  SocialLink,
  MenuCategory,
  MenuItem,
  Reservation,
  Order,
  Offer,
  GalleryItem,
  Review,
} from './types';

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  const { data } = await supabase
    .from('restaurant_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data as RestaurantSettings | null;
}

export async function getSeoSettings(): Promise<SeoSettings | null> {
  const { data } = await supabase
    .from('seo_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data as SeoSettings | null;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as SocialLink[]) || [];
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as MenuCategory[]) || [];
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true });
  return (data as MenuItem[]) || [];
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as MenuItem[]) || [];
}

export async function getOffers(): Promise<Offer[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .gte('valid_until', today)
    .order('sort_order', { ascending: true });
  return (data as Offer[]) || [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as GalleryItem[]) || [];
}

export async function getReviews(): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  return (data as Review[]) || [];
}

export async function createReservation(
  reservation: Omit<Reservation, 'id' | 'reservation_id' | 'created_at' | 'updated_at' | 'status'>
): Promise<{ data: Reservation | null; error: string | null }> {
  const reservationId = `EB-${Date.now().toString().slice(-8)}`;
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      ...reservation,
      reservation_id: reservationId,
      status: 'PENDING',
    })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as Reservation, error: null };
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'order_id' | 'status'>
): Promise<{ data: Order | null; error: string | null }> {
  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...order,
      order_id: orderId,
      status: 'PENDING',
    })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as Order, error: null };
}
