'use client';

import { motion } from 'framer-motion';
import { Tag, Calendar } from 'lucide-react';
import type { Offer } from '@/lib/types';

export function Offers({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;

  return (
    <section id="offers" className="relative bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">PROMOTIONS</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            EXCLUSIVE OFFERS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden border border-border bg-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="bg-gold px-3 py-1.5 text-xs font-bold tracking-widest text-primary-foreground">
                    {offer.discount}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  {offer.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-gold" />
                  <span>
                    Valid: {new Date(offer.valid_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {offer.terms && (
                  <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground/70">
                    {offer.terms}
                  </p>
                )}
                <button className="mt-4 flex items-center gap-2 border border-gold px-5 py-2 text-xs font-semibold tracking-widest text-gold transition-all hover:bg-gold hover:text-primary-foreground">
                  <Tag className="h-3.5 w-3.5" /> CLAIM OFFER
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
