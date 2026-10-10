'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetSeo, adminUpdateSeo } from '@/lib/admin-data';
import type { SeoSettings } from '@/lib/types';

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetSeo();
    setSeo(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!seo) return;
    setSaving(true);
    const ok = await adminUpdateSeo(seo.id, seo);
    setSaving(false);
    if (ok) toast.success('SEO settings saved'); else toast.error('Failed');
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  if (!seo) return <p className="mt-8 text-sm text-muted-foreground">No SEO settings found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">SEO Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage search engine optimization.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} SAVE
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 border border-border bg-card p-6">
        <div><label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">SEO TITLE</label><input type="text" value={seo.title} onChange={e => setSeo({...seo, title: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
        <div><label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">META DESCRIPTION</label><textarea rows={3} value={seo.description} onChange={e => setSeo({...seo, description: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
        <div><label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">KEYWORDS</label><input type="text" value={seo.keywords} onChange={e => setSeo({...seo, keywords: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
        <div><label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">OG IMAGE URL</label><input type="text" value={seo.og_image} onChange={e => setSeo({...seo, og_image: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
        <div><label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">CANONICAL URL</label><input type="text" value={seo.canonical_url} onChange={e => setSeo({...seo, canonical_url: e.target.value})} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" /></div>
      </div>
    </div>
  );
}
