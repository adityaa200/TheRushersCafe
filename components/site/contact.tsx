'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, MessageCircle } from 'lucide-react';
import type { RestaurantSettings } from '@/lib/types';
import { generateWhatsAppMessage, getWhatsAppLink } from '@/lib/whatsapp';

export function Contact({ settings }: { settings: RestaurantSettings }) {
  const waLink = getWhatsAppLink(
    settings.whatsapp,
    generateWhatsAppMessage(settings.name, [], 0)
  );

  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`;

  return (
    <section id="contact" className="relative bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">VISIT US</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            FIND YOUR WAY
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative h-full min-h-[350px] overflow-hidden border border-border"
          >
            <iframe
              src={mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px', filter: 'invert(0.9) hue-rotate(180deg) contrast(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant location map"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-6"
          >
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">ADDRESS</p>
                <p className="mt-1 text-sm text-muted-foreground">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-semibold tracking-widest text-foreground">PHONE</p>
                <a href={`tel:${settings.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-gold">
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="w-full">
                <p className="text-xs font-semibold tracking-widest text-foreground">OPENING HOURS</p>
                <div className="mt-2 space-y-1">
                  {settings.opening_hours?.map((h) => (
                    <div key={h.day} className="flex justify-between text-xs text-muted-foreground">
                      <span>{h.day}</span>
                      <span>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gold px-5 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90"
              >
                <Navigation className="h-3.5 w-3.5" /> GET DIRECTIONS
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 border border-border px-5 py-2.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:border-gold hover:text-gold"
              >
                <Phone className="h-3.5 w-3.5" /> CALL NOW
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-green-600/50 px-5 py-2.5 text-xs font-semibold tracking-widest text-green-600 transition-all hover:bg-green-600 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
