'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import type { Review } from '@/lib/types';

export function Reviews({ reviews, googleReviewUrl }: { reviews: Review[]; googleReviewUrl: string }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate, reviews.length]);

  if (reviews.length === 0) return null;

  const current = reviews[index];

  return (
    <section id="reviews" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">TESTIMONIALS</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            WHAT OUR GUESTS SAY
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.4 }}
              className="border border-border bg-card p-8 text-center sm:p-12"
            >
              <Quote className="mx-auto h-10 w-10 text-gold/40" />
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < current.rating ? 'fill-gold text-gold' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="mt-6 font-cormorant text-xl italic leading-relaxed text-foreground sm:text-2xl">
                &ldquo;{current.review}&rdquo;
              </p>
              <p className="mt-6 text-sm font-semibold tracking-widest text-foreground">
                — {current.name}
              </p>
            </motion.div>
          </AnimatePresence>

          {reviews.length > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 text-muted-foreground hover:text-gold"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 text-muted-foreground hover:text-gold"
                aria-label="Next review"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`h-1.5 transition-all ${i === index ? 'w-8 bg-gold' : 'w-1.5 bg-muted hover:bg-gold/50'}`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {googleReviewUrl && (
          <div className="mt-10 text-center">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground transition-all hover:border-gold hover:text-gold"
            >
              READ MORE REVIEWS <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
