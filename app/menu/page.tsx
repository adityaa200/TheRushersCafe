'use client';

import { useEffect, useState } from 'react';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { MenuSection } from '@/components/site/menu-section';
import { FloatingActions } from '@/components/site/floating-actions';
import { MobileBottomBar } from '@/components/site/mobile-bottom-bar';
import type { RestaurantSettings, MenuCategory, MenuItem, SocialLink } from '@/lib/types';
import { getRestaurantSettings, getMenuCategories, getMenuItems, getSocialLinks } from '@/lib/data';

const FALLBACK_SETTINGS: RestaurantSettings = {
  id: '',
  name: 'The Rushers Cafe',
  tagline: 'CRAFTED WITH PASSION. SERVED WITH SOUL.',
  cuisine: 'Modern European • Artisan Coffee',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'hello@therusherscafe.com',
  address: '123 MG Road, Koregaon Park, Pune, Maharashtra 411001',
  maps_url: '',
  latitude: '18.5204',
  longitude: '73.8567',
  opening_hours: [
    { day: 'Monday', hours: '9:00 AM – 11:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM – 11:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM – 11:00 PM' },
    { day: 'Thursday', hours: '9:00 AM – 11:00 PM' },
    { day: 'Friday', hours: '9:00 AM – 12:00 AM' },
    { day: 'Saturday', hours: '9:00 AM – 12:00 AM' },
    { day: 'Sunday', hours: '10:00 AM – 11:00 PM' },
  ],
  instagram: '@therusherscafe',
  google_review_url: '',
  hero_image: '',
  logo_url: '',
  price_range: '₹₹₹',
};

export default function MenuPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(FALLBACK_SETTINGS);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    (async () => {
      const [s, c, m, sl] = await Promise.all([
        getRestaurantSettings(),
        getMenuCategories(),
        getMenuItems(),
        getSocialLinks(),
      ]);
      if (s) setSettings(s);
      setCategories(c);
      setMenuItems(m);
      setSocialLinks(sl);
    })();
  }, []);

  return (
    <CartProvider>
      <Navbar restaurantName={settings.name} />
      <main className="pt-20">
        <MenuSection items={menuItems} categories={categories} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingActions restaurantName={settings.name} whatsappNumber={settings.whatsapp} />
      <MobileBottomBar whatsappNumber={settings.whatsapp} restaurantName={settings.name} />
    </CartProvider>
  );
}
