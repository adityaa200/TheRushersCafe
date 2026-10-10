'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminGetReservations, adminUpdateReservationStatus } from '@/lib/admin-data';
import type { Reservation } from '@/lib/types';

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-500 bg-yellow-500/10',
  CONFIRMED: 'text-green-500 bg-green-500/10',
  COMPLETED: 'text-blue-500 bg-blue-500/10',
  CANCELLED: 'text-red-500 bg-red-500/10',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetReservations();
    setReservations(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const ok = await adminUpdateReservationStatus(id, status);
    if (ok) { toast.success('Status updated'); load(); } else toast.error('Failed to update');
  };

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Reservations</h1>
      <p className="mt-1 text-sm text-muted-foreground">{reservations.length} total reservations</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['ALL', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`border px-3 py-1.5 text-xs font-medium tracking-wider ${filter === s ? 'border-gold bg-gold text-primary-foreground' : 'border-border text-muted-foreground hover:text-gold'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider text-muted-foreground">
              <th className="px-3 py-3 text-left">ID</th>
              <th className="px-3 py-3 text-left">NAME</th>
              <th className="px-3 py-3 text-left">PHONE</th>
              <th className="px-3 py-3 text-left">DATE</th>
              <th className="px-3 py-3 text-left">TIME</th>
              <th className="px-3 py-3 text-left">GUESTS</th>
              <th className="px-3 py-3 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-border/50">
                <td className="px-3 py-3 font-mono text-xs text-gold">{r.reservation_id}</td>
                <td className="px-3 py-3 text-foreground">{r.name}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.phone}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.time}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.guests}</td>
                <td className="px-3 py-3">
                  <select value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}
                    className={`border-0 px-2 py-1 text-[10px] font-semibold tracking-wider ${statusColors[r.status]}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
        {filtered.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No reservations found.</p>}
      </div>
    </div>
  );
}
