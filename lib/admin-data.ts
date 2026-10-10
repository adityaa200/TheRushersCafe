'use client';

import { supabase } from './supabase';
import type { MenuItem, MenuCategory, Reservation, Order, Offer, GalleryItem, Review, RestaurantSettings, SeoSettings, SocialLink } from './types';

// Menu Items
export async function adminGetMenuItems(): Promise<MenuItem[]> {
  const { data } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
  return (data as MenuItem[]) || [];
}

export async function adminCreateMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  const { error } = await supabase.from('menu_items').insert(item);
  return !error;
}

export async function adminUpdateMenuItem(id: string, updates: Partial<MenuItem>): Promise<boolean> {
  const { error } = await supabase.from('menu_items').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

export async function adminDeleteMenuItem(id: string): Promise<boolean> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  return !error;
}

// Categories
export async function adminGetCategories(): Promise<MenuCategory[]> {
  const { data } = await supabase.from('menu_categories').select('*').order('sort_order', { ascending: true });
  return (data as MenuCategory[]) || [];
}

export async function adminCreateCategory(name: string, slug: string, sortOrder: number): Promise<boolean> {
  const { error } = await supabase.from('menu_categories').insert({ name, slug, sort_order: sortOrder });
  return !error;
}

export async function adminDeleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  return !error;
}

// Reservations
export async function adminGetReservations(): Promise<Reservation[]> {
  const { data } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
  return (data as Reservation[]) || [];
}

export async function adminUpdateReservationStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('reservations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

// Orders
export async function adminGetOrders(): Promise<Order[]> {
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return (data as Order[]) || [];
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  return !error;
}

// Offers
export async function adminGetOffers(): Promise<Offer[]> {
  const { data } = await supabase.from('offers').select('*').order('sort_order', { ascending: true });
  return (data as Offer[]) || [];
}

export async function adminCreateOffer(offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  const { error } = await supabase.from('offers').insert(offer);
  return !error;
}

export async function adminUpdateOffer(id: string, updates: Partial<Offer>): Promise<boolean> {
  const { error } = await supabase.from('offers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

export async function adminDeleteOffer(id: string): Promise<boolean> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  return !error;
}

// Gallery
export async function adminGetGallery(): Promise<GalleryItem[]> {
  const { data } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true });
  return (data as GalleryItem[]) || [];
}

export async function adminCreateGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('gallery').insert(item);
  return !error;
}

export async function adminDeleteGalleryItem(id: string): Promise<boolean> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  return !error;
}

// Reviews
export async function adminGetReviews(): Promise<Review[]> {
  const { data } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
  return (data as Review[]) || [];
}

export async function adminCreateReview(review: Omit<Review, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('reviews').insert(review);
  return !error;
}

export async function adminDeleteReview(id: string): Promise<boolean> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  return !error;
}

// Settings
export async function adminGetSettings(): Promise<RestaurantSettings | null> {
  const { data } = await supabase.from('restaurant_settings').select('*').limit(1).maybeSingle();
  return data as RestaurantSettings | null;
}

export async function adminUpdateSettings(id: string, updates: Partial<RestaurantSettings>): Promise<boolean> {
  const { error } = await supabase.from('restaurant_settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

// SEO
export async function adminGetSeo(): Promise<SeoSettings | null> {
  const { data } = await supabase.from('seo_settings').select('*').limit(1).maybeSingle();
  return data as SeoSettings | null;
}

export async function adminUpdateSeo(id: string, updates: Partial<SeoSettings>): Promise<boolean> {
  const { error } = await supabase.from('seo_settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

// Social Links
export async function adminGetSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
  return (data as SocialLink[]) || [];
}

export async function adminCreateSocialLink(link: Omit<SocialLink, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('social_links').insert(link);
  return !error;
}

export async function adminDeleteSocialLink(id: string): Promise<boolean> {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  return !error;
}
