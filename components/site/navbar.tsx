'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'HOME', href: '/#home' },
  { label: 'MENU', href: '/#menu' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'GALLERY', href: '/#gallery' },
  { label: 'OFFERS', href: '/#offers' },
  { label: 'REVIEWS', href: '/#reviews' },
  { label: 'CONTACT', href: '/#contact' },
];

export function Navbar({ restaurantName }: { restaurantName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/50 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2" aria-label={restaurantName}>
            <span className={cn(
              'font-serif text-xl font-bold tracking-wide transition-colors sm:text-2xl',
              scrolled ? 'text-foreground' : 'text-foreground'
            )}>
              The <span className="text-gold">Rushers</span> Cafe
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-widest text-muted-foreground transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#reservation"
              className="hidden rounded-none border border-gold bg-gold px-6 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-transparent hover:text-gold sm:inline-block"
            >
              RESERVE TABLE
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-serif text-xl font-bold text-foreground">
                The <span className="text-gold">Rushers</span> Cafe
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-foreground" />
              </button>
            </div>
            <motion.nav
              className="flex flex-col items-center justify-center gap-6 px-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-2xl font-medium text-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-4 flex w-full max-w-xs flex-col gap-3"
              >
                <Link
                  href="/#reservation"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-none bg-gold py-3 text-center text-sm font-semibold tracking-widest text-primary-foreground"
                >
                  RESERVE A TABLE
                </Link>
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 rounded-none border border-border py-3 text-sm font-medium tracking-widest text-foreground"
                >
                  <Phone className="h-4 w-4" /> CALL NOW
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
