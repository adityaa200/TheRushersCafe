'use client';

import Link from 'next/link';
import { UtensilsCrossed, CalendarCheck, MessageCircle, LayoutGrid } from 'lucide-react';

export function MobileBottomBar({ whatsappNumber, restaurantName }: { whatsappNumber: string; restaurantName: string }) {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${restaurantName}, I would like to know more.`)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <Link
        href="/#menu"
        className="flex flex-col items-center gap-1 py-3 text-muted-foreground transition-colors active:text-gold"
      >
        <LayoutGrid className="h-5 w-5" />
        <span className="text-[10px] font-medium tracking-wider">MENU</span>
      </Link>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 py-3 text-muted-foreground transition-colors active:text-green-600"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-[10px] font-medium tracking-wider">ORDER</span>
      </a>
      <Link
        href="/#reservation"
        className="flex flex-col items-center gap-1 py-3 text-muted-foreground transition-colors active:text-gold"
      >
        <CalendarCheck className="h-5 w-5" />
        <span className="text-[10px] font-medium tracking-wider">RESERVE</span>
      </Link>
      <Link
        href="/#contact"
        className="flex flex-col items-center gap-1 py-3 text-muted-foreground transition-colors active:text-gold"
      >
        <UtensilsCrossed className="h-5 w-5" />
        <span className="text-[10px] font-medium tracking-wider">INFO</span>
      </Link>
    </div>
  );
}
