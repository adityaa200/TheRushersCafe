'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetGallery, adminCreateGalleryItem, adminDeleteGalleryItem } from '@/lib/admin-data';
import type { GalleryItem } from '@/lib/types';

const CATEGORIES = ['FOOD', 'AMBIENCE', 'COFFEE', 'EVENTS'];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetGallery();
    setItems(data);
    setLoading(false);
  };

  const handleAdd = async (data: { title: string; image: string; category: string }) => {
    const ok = await adminCreateGalleryItem({ ...data, sort_order: 0 });
    if (ok) { toast.success('Image added'); setShowForm(false); load(); } else toast.error('Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const ok = await adminDeleteGalleryItem(id);
    if (ok) { toast.success('Deleted'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} images</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> ADD IMAGE
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(item => (
          <div key={item.id} className="group relative overflow-hidden border border-border">
            <img src={item.image} alt={item.title} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-background/90 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="self-start bg-gold/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground">{item.category}</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">{item.title}</span>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {items.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No images yet.</p>}

      {showForm && <GalleryForm onSave={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function GalleryForm({ onSave, onClose }: { onSave: (d: { title: string; image: string; category: string }) => void; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', image: '', category: 'FOOD' });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Add Image</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(form)} className="flex-1 bg-gold py-3 text-xs font-semibold tracking-widest text-primary-foreground">ADD</button>
          <button onClick={onClose} className="border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground">CANCEL</button>
        </div>
      </div>
    </div>
  );
}
