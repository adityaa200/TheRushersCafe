'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { RestaurantSettings, SocialLink } from '@/lib/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export function Footer({
  settings,
  socialLinks,
}: {
  settings: RestaurantSettings;
  socialLinks: SocialLink[];
}) {
  const quickLinks = [
    { label: 'Menu', href: '/#menu' },
    { label: 'About', href: '/#about' },
    { label: 'Reservations', href: '/#reservation' },
    { label: 'Offers', href: '/#offers' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="relative border-t border-border bg-background pt-16 pb-24 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              The <span className="text-gold">Rushers</span> Cafe
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {settings.tagline}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {settings.cuisine}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-foreground">QUICK LINKS</p>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-foreground">CONTACT</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {settings.address}
              </li>
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + Social */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-foreground">OPENING HOURS</p>
            <ul className="mt-4 space-y-1">
              {settings.opening_hours?.map((h) => (
                <li key={h.day} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Clock className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                  <span>{h.day}: {h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
          {socialLinks.map((social) => {
            const Icon = ICONS[social.icon] || Instagram;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-gold hover:text-gold"
                aria-label={social.platform}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-muted-foreground/50 hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
