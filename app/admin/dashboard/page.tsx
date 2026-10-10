'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CalendarCheck, Clock, ShoppingCart, Tag, UtensilsCrossed, Star, TrendingUp } from 'lucide-react';
import type { Reservation, Order, Offer, MenuItem, Review } from '@/lib/types';
import { formatPrice } from '@/lib/whatsapp';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayReservations: 0,
    pendingReservations: 0,
    orders: 0,
    activeOffers: 0,
    menuItems: 0,
    reviews: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().split('T')[0];

      const [reservations, orders, offers, menuItems, reviews] = await Promise.all([
        supabase.from('reservations').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('offers').select('*').eq('is_active', true),
        supabase.from('menu_items').select('*').eq('is_available', true),
        supabase.from('reviews').select('*').eq('is_featured', true),
      ]);

      const resData = (reservations.data as Reservation[]) || [];
      const todayRes = resData.filter((r) => r.date === today);
      const pendingRes = resData.filter((r) => r.status === 'PENDING');

      setStats({
        todayReservations: todayRes.length,
        pendingReservations: pendingRes.length,
        orders: (orders.data as Order[])?.length || 0,
        activeOffers: (offers.data as Offer[])?.length || 0,
        menuItems: (menuItems.data as MenuItem[])?.length || 0,
        reviews: (reviews.data as Review[])?.length || 0,
      });

      setRecentReservations(resData.slice(0, 5));
      setRecentOrders((orders.data as Order[]) || []);
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Today's Reservations", value: stats.todayReservations, icon: CalendarCheck },
    { label: 'Pending Reservations', value: stats.pendingReservations, icon: Clock },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Active Offers', value: stats.activeOffers, icon: Tag },
    { label: 'Menu Items', value: stats.menuItems, icon: UtensilsCrossed },
    { label: 'Reviews', value: stats.reviews, icon: Star },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-500 bg-yellow-500/10',
    CONFIRMED: 'text-green-500 bg-green-500/10',
    COMPLETED: 'text-blue-500 bg-blue-500/10',
    CANCELLED: 'text-red-500 bg-red-500/10',
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your restaurant activity.</p>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-gold" />
                <TrendingUp className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <p className="mt-3 font-serif text-2xl font-bold text-foreground">{card.value}</p>
              <p className="mt-1 text-[10px] tracking-wider text-muted-foreground">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Reservations */}
        <div className="border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-foreground">RECENT RESERVATIONS</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : recentReservations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reservations yet.</p>
          ) : (
            <div className="space-y-3">
              {recentReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} • {r.time} • {r.guests} guests</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-semibold tracking-wider ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-foreground">RECENT ORDERS</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{o.order_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(o.items) ? `${o.items.length} items` : '—'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gold">{formatPrice(Number(o.total))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
