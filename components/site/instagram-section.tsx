'use client';

import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';

const INSTAGRAM_IMAGES = [
  'https://images.pexels.com/photos/2773940/pexels-photo-2773940.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/7491886/pexels-photo-7491886.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/2096840/pexels-photo-2096840.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/6223177/pexels-photo-6223177.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/5638516/pexels-photo-5638516.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/12653336/pexels-photo-12653336.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
];

export function InstagramSection({ username }: { username: string }) {
  const cleanUsername = username.replace('@', '');
  const profileUrl = `https://instagram.com/${cleanUsername}`;

  return (
    <section className="relative bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">SOCIAL</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            FOLLOW OUR JOURNEY
          </h2>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <Instagram className="h-4 w-4" /> {username}
          </a>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {INSTAGRAM_IMAGES.map((img, index) => (
            <motion.a
              key={index}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={img}
                alt={`Instagram post ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-gold" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gold px-6 py-3 text-xs font-semibold tracking-widest text-gold transition-all hover:bg-gold hover:text-primary-foreground"
          >
            FOLLOW ON INSTAGRAM <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground/60">
          Sample feed — connect your Instagram account for live updates.
        </p>
      </div>
    </section>
  );
}
