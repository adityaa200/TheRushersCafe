'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';

export function AnnouncementBar({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      className="relative z-40 overflow-hidden bg-gold"
    >
      <div className="flex items-center justify-center gap-3 px-10 py-2">
        <Gift className="h-3.5 w-3.5 shrink-0 text-primary-foreground" />
        <p className="text-[11px] font-medium tracking-wider text-primary-foreground">
          {message}
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ExitIntentPopup({ title, description }: { title: string; description: string }) {
  const [show, setShow] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);

  useEffect(() => {
    if (shownOnce) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shownOnce) {
        setShow(true);
        setShownOnce(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [shownOnce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-md border border-gold/30 bg-card p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <Gift className="mx-auto h-12 w-12 text-gold" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-foreground">{title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{description}</p>
            <a
              href="/#reservation"
              onClick={() => setShow(false)}
              className="mt-6 inline-block bg-gold px-6 py-3 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90"
            >
              RESERVE NOW
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          JOIN OUR CIRCLE
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Subscribe for exclusive offers, new menu updates, and special events.
        </p>
        {submitted ? (
          <p className="mt-6 text-sm text-gold">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="rounded-none border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none sm:w-72"
            />
            <button
              type="submit"
              className="rounded-none bg-gold px-6 py-3 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90"
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
