'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/admin-data';
import { formatPrice } from '@/lib/whatsapp';
import type { Order } from '@/lib/types';

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

const paymentColors: Record<string, string> = {
  PAID: 'text-green-500 bg-green-500/10',
  PENDING: 'text-yellow-500 bg-yellow-500/10',
  UNPAID: 'text-red-500 bg-red-500/10',
  FAILED: 'text-red-500 bg-red-500/10',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const ok = await adminUpdateOrderStatus(id, status);
    if (ok) { toast.success('Order status updated'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>

      <div className="mt-6 space-y-4">
        {orders.map(o => (
          <div key={o.id} className="border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-gold">{o.order_id}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-3">
                {o.payment_status && o.payment_status !== 'UNPAID' && (
                  <span className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold tracking-wider ${paymentColors[o.payment_status] || 'text-muted-foreground bg-secondary'}`}>
                    <CreditCard className="h-3 w-3" /> {o.payment_status}
                  </span>
                )}
                <span className="font-serif text-lg font-bold text-foreground">{formatPrice(Number(o.total))}</span>
                <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                  className="border border-border bg-secondary/50 px-2 py-1 text-xs text-foreground focus:border-gold focus:outline-none">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {o.payment_id && (
              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                <CreditCard className="h-3 w-3 text-gold" />
                Payment ID: <span className="font-mono text-gold">{o.payment_id}</span>
              </div>
            )}
            {Array.isArray(o.items) && o.items.length > 0 && (
              <div className="mt-3 border-t border-border/50 pt-3">
                {o.items.map((item: { name: string; price: number; quantity: number }, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.quantity} × {item.name}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {orders.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No orders yet.</p>}
    </div>
  );
}
