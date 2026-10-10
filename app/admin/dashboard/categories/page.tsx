'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetCategories, adminCreateCategory, adminDeleteCategory } from '@/lib/admin-data';
import type { MenuCategory } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async (name: string, slug: string, sortOrder: number) => {
    const ok = await adminCreateCategory(name, slug, sortOrder);
    if (ok) { toast.success('Category added'); setShowForm(false); load(); } else toast.error('Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Items in this category will lose their category link.')) return;
    const ok = await adminDeleteCategory(id);
    if (ok) { toast.success('Deleted'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> ADD CATEGORY
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between border border-border bg-card p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">/{c.slug}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {categories.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No categories yet.</p>}

      {showForm && <CatForm onSave={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function CatForm({ onSave, onClose }: { onSave: (name: string, slug: string, sort: number) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sort, setSort] = useState(0);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Add Category</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Category name" value={name} onChange={e => { setName(e.target.value); setSlug(slugify(e.target.value)); }} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="text" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="number" placeholder="Sort order" value={sort} onChange={e => setSort(Number(e.target.value))} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(name, slug, sort)} className="flex-1 bg-gold py-3 text-xs font-semibold tracking-widest text-primary-foreground">ADD</button>
          <button onClick={onClose} className="border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground">CANCEL</button>
        </div>
      </div>
    </div>
  );
}
