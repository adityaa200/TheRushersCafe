'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createReservation } from '@/lib/data';

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
];

export function Reservation() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    special_request: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const { data, error } = await createReservation({
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: form.time,
      guests: form.guests,
      special_request: form.special_request,
    });
    setLoading(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    setSuccess(data?.reservation_id || 'EB-00000000');
    toast.success('Reservation request received!');
    setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, special_request: '' });
  };

  return (
    <section id="reservation" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">RESERVATIONS</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            BOOK YOUR TABLE
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Secure your spot for an unforgettable dining experience.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 border border-gold/30 bg-card p-8 text-center sm:p-12"
          >
            <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
            <h3 className="mt-6 font-serif text-2xl font-bold text-foreground">
              Your reservation request has been received.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Reservation ID: <span className="font-mono font-bold text-gold">{success}</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              We will confirm your booking via phone shortly.
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-6 border border-border px-6 py-2.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:border-gold hover:text-gold"
            >
              MAKE ANOTHER RESERVATION
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-10 grid grid-cols-1 gap-5 border border-border bg-card p-6 sm:p-8 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                NAME *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                PHONE *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                EMAIL
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                GUESTS
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 pl-9 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value={12}>10+ Guests</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                DATE *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 pl-9 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                TIME *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 pl-9 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">
                SPECIAL REQUEST
              </label>
              <textarea
                value={form.special_request}
                onChange={(e) => setForm({ ...form, special_request: e.target.value })}
                rows={3}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="Birthday celebration, window seat, dietary requirements..."
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-none bg-gold py-3.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> CONFIRMING...</>
                ) : (
                  'CONFIRM RESERVATION'
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
