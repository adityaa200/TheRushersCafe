'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetOffers, adminCreateOffer, adminUpdateOffer, adminDeleteOffer } from '@/lib/admin-data';
import type { Offer } from '@/lib/types';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetOffers();
    setOffers(data);
    setLoading(false);
  };

  const handleSave = async (data: Partial<Offer>) => {
    if (editing) {
      const ok = await adminUpdateOffer(editing.id, data);
      if (ok) toast.success('Offer updated'); else toast.error('Failed');
    } else {
      const ok = await adminCreateOffer({
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        discount: data.discount || '',
        valid_from: data.valid_from || new Date().toISOString().split('T')[0],
        valid_until: data.valid_until || new Date().toISOString().split('T')[0],
        terms: data.terms || '',
        is_active: data.is_active ?? true,
        sort_order: data.sort_order || 0,
      });
      if (ok) toast.success('Offer created'); else toast.error('Failed');
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    const ok = await adminDeleteOffer(id);
    if (ok) { toast.success('Offer deleted'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Offers</h1>
          <p className="mt-1 text-sm text-muted-foreground">{offers.length} offers</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> ADD OFFER
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {offers.map(o => (
          <div key={o.id} className="border border-border bg-card p-4">
            <div className="flex gap-3">
              {o.image && <img src={o.image} alt={o.title} className="h-16 w-16 shrink-0 object-cover" />}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{o.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{o.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                  <span className="bg-gold/10 px-1.5 py-0.5 text-gold">{o.discount}</span>
                  <span className="text-muted-foreground">{o.valid_from} → {o.valid_until}</span>
                  <span className={o.is_active ? 'text-green-500' : 'text-red-500'}>{o.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-3">
              <button onClick={() => { setEditing(o); setShowForm(true); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(o.id)} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {offers.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No offers yet.</p>}

      {showForm && <OfferForm offer={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function OfferForm({ offer, onSave, onClose }: { offer: Offer | null; onSave: (d: Partial<Offer>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    image: offer?.image || '',
    discount: offer?.discount || '',
    valid_from: offer?.valid_from || new Date().toISOString().split('T')[0],
    valid_until: offer?.valid_until || new Date().toISOString().split('T')[0],
    terms: offer?.terms || '',
    is_active: offer?.is_active ?? true,
    sort_order: offer?.sort_order || 0,
  });

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">{offer ? 'Edit Offer' : 'Add Offer'}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <textarea rows={2} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="text" placeholder="Discount (e.g. 20% OFF)" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1.5 block text-xs text-muted-foreground">VALID FROM</label><input type="date" value={form.valid_from} onChange={e => setForm({...form, valid_from: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-xs text-muted-foreground">VALID UNTIL</label><input type="date" value={form.valid_until} onChange={e => setForm({...form, valid_until: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
          </div>
          <textarea rows={2} placeholder="Terms & conditions" value={form.terms} onChange={e => setForm({...form, terms: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(form)} className="flex-1 bg-gold py-3 text-xs font-semibold tracking-widest text-primary-foreground">{offer ? 'UPDATE' : 'CREATE'}</button>
          <button onClick={onClose} className="border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground">CANCEL</button>
        </div>
      </div>
    </div>
  );
}
