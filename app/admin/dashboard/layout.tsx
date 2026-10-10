'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, LayoutDashboard, UtensilsCrossed, Tag, CalendarCheck, ShoppingCart, GalleryHorizontalEnd, Star, Settings, Search, Share2, Users, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Menu', href: '/admin/dashboard/menu', icon: UtensilsCrossed },
  { label: 'Categories', href: '/admin/dashboard/categories', icon: Tag },
  { label: 'Reservations', href: '/admin/dashboard/reservations', icon: CalendarCheck },
  { label: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingCart },
  { label: 'Offers', href: '/admin/dashboard/offers', icon: Tag },
  { label: 'Gallery', href: '/admin/dashboard/gallery', icon: GalleryHorizontalEnd },
  { label: 'Reviews', href: '/admin/dashboard/reviews', icon: Star },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
  { label: 'SEO', href: '/admin/dashboard/seo', icon: Search },
  { label: 'Social', href: '/admin/dashboard/social', icon: Share2 },
  { label: 'Users', href: '/admin/dashboard/users', icon: Users },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
        return;
      }
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <span className="font-serif text-lg font-bold text-foreground">
          The Rushers Cafe
        </span>
        <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <MenuIcon className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <Link href="/admin/dashboard" className="font-serif text-xl font-bold text-foreground">
            The Rushers Cafe
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-gold/10 text-gold border-l-2 border-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
