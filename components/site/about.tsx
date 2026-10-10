'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, UtensilsCrossed, Flame } from 'lucide-react';
import type { RestaurantSettings } from '@/lib/types';

export function About({ settings }: { settings: RestaurantSettings }) {
  const hours = settings.opening_hours || [];

  return (
    <section id="about" className="relative bg-background py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/37968303/pexels-photo-37968303.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Restaurant interior"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden bg-gold p-6 text-center sm:block">
            <p className="font-serif text-3xl font-bold text-primary-foreground">10+</p>
            <p className="text-[10px] tracking-widest text-primary-foreground/80">YEARS OF<br />CRAFT</p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.3em] text-gold">OUR STORY</p>
          <h2 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            MORE THAN A MEAL.
            <br />
            <span className="text-gold">IT&apos;S AN EXPERIENCE.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Born from a love for European flavors and artisan coffee culture, {settings.name}
            began as a small kitchen with big dreams. Today, we serve handcrafted dishes
            made with locally sourced ingredients, paired with coffee roasted in-house.
            Every plate tells a story of passion, precision, and soul.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">LOCATION</p>
                <p className="mt-1 text-sm text-muted-foreground">{settings.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UtensilsCrossed className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">CUISINE</p>
                <p className="mt-1 text-sm text-muted-foreground">{settings.cuisine}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">HOURS</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hours[0]?.hours} – {hours[5]?.hours}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flame className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">PHILOSOPHY</p>
                <p className="mt-1 text-sm text-muted-foreground">Crafted with passion, served with soul.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs font-semibold tracking-widest text-foreground mb-3">OPENING HOURS</p>
            <div className="space-y-1.5">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between text-xs text-muted-foreground">
                  <span>{h.day}</span>
                  <span>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
