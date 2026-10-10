'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetSocialLinks, adminCreateSocialLink, adminDeleteSocialLink } from '@/lib/admin-data';
import type { SocialLink } from '@/lib/types';

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetSocialLinks();
    setLinks(data);
    setLoading(false);
  };

  const handleAdd = async (data: { platform: string; url: string; icon: string; sort_order: number }) => {
    const ok = await adminCreateSocialLink(data);
    if (ok) { toast.success('Social link added'); setShowForm(false); load(); } else toast.error('Failed');
  };

  const handleDelete = async (id: string) => {
    const ok = await adminDeleteSocialLink(id);
    if (ok) { toast.success('Deleted'); load(); } else toast.error('Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Social Media</h1>
          <p className="mt-1 text-sm text-muted-foreground">{links.length} links</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> ADD LINK
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {links.map(l => (
          <div key={l.id} className="flex items-center justify-between border border-border bg-card p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{l.platform}</p>
              <p className="text-xs text-muted-foreground">{l.url}</p>
            </div>
            <button onClick={() => handleDelete(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading...</p>}
      {links.length === 0 && !loading && <p className="mt-8 text-center text-sm text-muted-foreground">No social links yet.</p>}

      {showForm && (
        <SocialForm onSave={handleAdd} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function SocialForm({ onSave, onClose }: { onSave: (d: { platform: string; url: string; icon: string; sort_order: number }) => void; onClose: () => void }) {
  const [form, setForm] = useState({ platform: '', url: '', icon: 'instagram', sort_order: 0 });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Add Social Link</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Platform (e.g. Instagram)" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <input type="text" placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
          <select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
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
