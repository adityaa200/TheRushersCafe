'use client';

import { useEffect, useState } from 'react';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/site/navbar';
import { Hero } from '@/components/site/hero';
import { About } from '@/components/site/about';
import { MenuSection } from '@/components/site/menu-section';
import { Gallery } from '@/components/site/gallery';
import { Reservation } from '@/components/site/reservation';
import { Offers } from '@/components/site/offers';
import { Reviews } from '@/components/site/reviews';
import { Contact } from '@/components/site/contact';
import { Footer } from '@/components/site/footer';
import { FloatingActions } from '@/components/site/floating-actions';
import { MobileBottomBar } from '@/components/site/mobile-bottom-bar';
import { QRSection } from '@/components/site/qr-section';
import { InstagramSection } from '@/components/site/instagram-section';
import { AnnouncementBar, ExitIntentPopup, NewsletterSignup } from '@/components/site/extras';
import type {
  RestaurantSettings,
  MenuCategory,
  MenuItem,
  Offer,
  GalleryItem,
  Review,
  SocialLink,
} from '@/lib/types';
import {
  getRestaurantSettings,
  getMenuCategories,
  getMenuItems,
  getOffers,
  getGalleryItems,
  getReviews,
  getSocialLinks,
} from '@/lib/data';

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

export default function HomePage() {
  const [settings, setSettings] = useState<RestaurantSettings>(FALLBACK_SETTINGS);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, c, m, o, g, r, sl] = await Promise.all([
        getRestaurantSettings(),
        getMenuCategories(),
        getMenuItems(),
        getOffers(),
        getGalleryItems(),
        getReviews(),
        getSocialLinks(),
      ]);
      if (s) setSettings(s);
      setCategories(c);
      setMenuItems(m);
      setOffers(o);
      setGalleryItems(g);
      setReviews(r);
      setSocialLinks(sl);
      setLoading(false);
    })();
  }, []);

  return (
    <CartProvider>
      <AnnouncementBar message="WEEKEND SPECIAL: 20% OFF on selected signature dishes — Every Friday to Sunday" />
      <Navbar restaurantName={settings.name} />
      <main>
        <Hero restaurantName={settings.name} tagline={settings.tagline} />
        <About settings={settings} />
        <MenuSection items={menuItems} categories={categories} />
        <Offers offers={offers} />
        <Gallery items={galleryItems} />
        <Reservation />
        <QRSection />
        <Reviews reviews={reviews} googleReviewUrl={settings.google_review_url} />
        <InstagramSection username={settings.instagram} />
        <NewsletterSignup />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingActions restaurantName={settings.name} whatsappNumber={settings.whatsapp} />
      <MobileBottomBar whatsappNumber={settings.whatsapp} restaurantName={settings.name} />
      <ExitIntentPopup
        title="Wait! Before you go..."
        description="Get 10% off your first order when you reserve a table today."
      />
    </CartProvider>
  );
}
