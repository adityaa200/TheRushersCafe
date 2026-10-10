'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Search, Star, Flame, Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetMenuItems, adminCreateMenuItem, adminUpdateMenuItem, adminDeleteMenuItem, adminGetCategories } from '@/lib/admin-data';
import { formatPrice } from '@/lib/whatsapp';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [m, c] = await Promise.all([adminGetMenuItems(), adminGetCategories()]);
    setItems(m);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<MenuItem>) => {
    if (editing) {
      const ok = await adminUpdateMenuItem(editing.id, data);
      if (ok) toast.success('Item updated'); else toast.error('Failed to update');
    } else {
      const cat = categories.find(c => c.id === data.category_id);
      const ok = await adminCreateMenuItem({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        category_id: data.category_id || null,
        category_name: cat?.name || '',
        image: data.image || '',
        is_vegetarian: data.is_vegetarian || false,
        is_spicy: data.is_spicy || false,
        is_bestseller: data.is_bestseller || false,
        is_available: data.is_available ?? true,
        sort_order: data.sort_order || 0,
      });
      if (ok) toast.success('Item added'); else toast.error('Failed to add');
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    const ok = await adminDeleteMenuItem(id);
    if (ok) { toast.success('Item deleted'); load(); } else toast.error('Failed to delete');
  };

  const toggleAvailable = async (item: MenuItem) => {
    await adminUpdateMenuItem(item.id, { is_available: !item.is_available });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Menu Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} items total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> ADD ITEM
        </button>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-card px-3 py-2.5 pl-10 text-sm text-foreground focus:border-gold focus:outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <div key={item.id} className="border border-border bg-card p-4">
            <div className="flex gap-3">
              {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-foreground">{item.name}</h3>
                  <span className="shrink-0 font-serif text-lg font-bold text-gold">{formatPrice(item.price)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-muted-foreground bg-secondary">{item.category_name}</span>
                  {item.is_bestseller && <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-gold bg-gold/10"><Star className="h-2.5 w-2.5" />BEST</span>}
                  {item.is_spicy && <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-red-500 bg-red-500/10"><Flame className="h-2.5 w-2.5" />SPICY</span>}
                  {item.is_vegetarian && <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-green-600 bg-green-600/10"><Leaf className="h-2.5 w-2.5" />VEG</span>}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-3">
              <button onClick={() => { setEditing(item); setShowForm(true); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => toggleAvailable(item)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
                {item.is_available ? <><Eye className="h-3.5 w-3.5" /> Visible</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
              </button>
              <button onClick={() => handleDelete(item.id)} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {filtered.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No items found.</p>}

      {showForm && (
        <MenuItemForm
          item={editing}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function MenuItemForm({ item, categories, onSave, onClose }: {
  item: MenuItem | null;
  categories: MenuCategory[];
  onSave: (data: Partial<MenuItem>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category_id: item?.category_id || '',
    image: item?.image || '',
    is_vegetarian: item?.is_vegetarian || false,
    is_spicy: item?.is_spicy || false,
    is_bestseller: item?.is_bestseller || false,
    is_available: item?.is_available ?? true,
    sort_order: item?.sort_order || 0,
  });

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">NAME</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">DESCRIPTION</label>
            <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">PRICE (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">CATEGORY</label>
              <select value={form.category_id || ''} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">IMAGE URL</label>
            <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_vegetarian} onChange={e => setForm({...form, is_vegetarian: e.target.checked})} /> Vegetarian</label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_spicy} onChange={e => setForm({...form, is_spicy: e.target.checked})} /> Spicy</label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_bestseller} onChange={e => setForm({...form, is_bestseller: e.target.checked})} /> Bestseller</label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} /> Available</label>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">SORT ORDER</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(form)} className="flex-1 bg-gold py-3 text-xs font-semibold tracking-widest text-primary-foreground">{item ? 'UPDATE' : 'CREATE'}</button>
          <button onClick={onClose} className="border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground">CANCEL</button>
        </div>
      </div>
    </div>
  );
}
