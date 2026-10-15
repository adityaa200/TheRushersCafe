'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetReviews, adminCreateReview, adminDeleteReview } from '@/lib/admin-data';
import type { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetReviews();
    setReviews(data);
    setLoading(false);
  };

  const handleAdd = async (data: { name: string; rating: number; review: string; is_featured: boolean }) => {
    const ok = await adminCreateReview({ ...data, photo: '', sort_order: 0 });
    if (ok) { toast.success('Review added'); setShowForm(false); load(); } else toast.error('Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const ok = await adminDeleteReview(id);
    if (ok) { toast.success('Deleted'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> ADD REVIEW
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reviews.map(r => (
          <div key={r.id} className="border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{r.name}</h3>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({length: 5}).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />)}
                </div>
              </div>
              <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{r.review}</p>
            <span className={`mt-2 inline-block text-[10px] ${r.is_featured ? 'text-green-500' : 'text-muted-foreground'}`}>{r.is_featured ? 'FEATURED' : 'HIDDEN'}</span>
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {reviews.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No reviews yet.</p>}

      {showForm && <ReviewForm onSave={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function ReviewForm({ onSave, onClose }: { onSave: (d: { name: string; rating: number; review: string; is_featured: boolean }) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', rating: 5, review: '', is_featured: true });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Add Review</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Customer name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">RATING</label>
            <select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
            </select>
          </div>
          <textarea rows={3} placeholder="Review text" value={form.review} onChange={e => setForm({...form, review: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Featured (visible on website)</label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(form)} className="flex-1 bg-gold py-3 text-xs font-semibold tracking-widest text-primary-foreground">ADD</button>
          <button onClick={onClose} className="border border-border px-6 py-3 text-xs font-semibold tracking-widest text-foreground">CANCEL</button>
        </div>
      </div>
    </div>
  );
}
