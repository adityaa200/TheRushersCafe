'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function Hero({ restaurantName, tagline }: { restaurantName: string; tagline: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="home" className="relative grain flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/19692020/pexels-photo-19692020.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <img
          src="https://images.pexels.com/photos/19692020/pexels-photo-19692020.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Chef cooking with flame"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center px-4 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4 text-xs font-medium tracking-[0.4em] text-gold sm:text-sm"
        >
          {restaurantName}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {tagline.split('.').map((line, i) => (
            <span key={i} className="block">
              {line.trim()}
              {i < tagline.split('.').length - 2 && '.'}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-6 max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg"
        >
          Experience handcrafted food, signature flavors and unforgettable moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/#reservation"
            className="rounded-none border border-gold bg-gold px-8 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-transparent hover:text-gold sm:text-sm"
          >
            RESERVE A TABLE
          </Link>
          <Link
            href="/#menu"
            className="rounded-none border border-border px-8 py-3.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:border-gold hover:text-gold sm:text-sm"
          >
            EXPLORE MENU
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
