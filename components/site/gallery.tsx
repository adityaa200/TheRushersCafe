'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORIES = ['ALL', 'FOOD', 'AMBIENCE', 'COFFEE', 'EVENTS'];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'ALL') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
  const prevImage = () =>
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));

  return (
    <section id="gallery" className="relative bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">GALLERY</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            A FEAST FOR THE EYES
          </h2>
        </motion.div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-none border px-4 py-2 text-xs font-medium tracking-widest transition-all',
                activeCategory === cat
                  ? 'border-gold bg-gold text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-gold hover:text-gold'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
              className="group relative cursor-pointer overflow-hidden"
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  <p className="text-[10px] tracking-widest text-gold">{item.category}</p>
                  <p className="font-serif text-sm text-foreground">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-6 top-6 text-foreground hover:text-gold"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground hover:text-gold"
              aria-label="Previous"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightboxIndex].image}
              alt={filtered[lightboxIndex].title}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-gold"
              aria-label="Next"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-serif text-lg text-foreground">{filtered[lightboxIndex].title}</p>
              <p className="text-xs tracking-widest text-gold">{filtered[lightboxIndex].category}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
