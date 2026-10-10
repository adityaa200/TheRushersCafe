'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetSettings, adminUpdateSettings } from '@/lib/admin-data';
import type { RestaurantSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await adminGetSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const ok = await adminUpdateSettings(settings.id, settings);
    setSaving(false);
    if (ok) toast.success('Settings saved'); else toast.error('Failed to save');
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  if (!settings) return <p className="mt-8 text-sm text-muted-foreground">No settings found.</p>;

  const update = (field: keyof RestaurantSettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Restaurant Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update your restaurant information.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} SAVE
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="RESTAURANT NAME" value={settings.name} onChange={v => update('name', v)} />
        <Field label="TAGLINE" value={settings.tagline} onChange={v => update('tagline', v)} />
        <Field label="CUISINE" value={settings.cuisine} onChange={v => update('cuisine', v)} />
        <Field label="PRICE RANGE" value={settings.price_range} onChange={v => update('price_range', v)} />
        <Field label="PHONE" value={settings.phone} onChange={v => update('phone', v)} />
        <Field label="WHATSAPP (digits only)" value={settings.whatsapp} onChange={v => update('whatsapp', v)} />
        <Field label="EMAIL" value={settings.email} onChange={v => update('email', v)} />
        <Field label="INSTAGRAM" value={settings.instagram} onChange={v => update('instagram', v)} />
        <Field label="ADDRESS" value={settings.address} onChange={v => update('address', v)} full />
        <Field label="MAPS URL" value={settings.maps_url} onChange={v => update('maps_url', v)} full />
        <Field label="LATITUDE" value={settings.latitude} onChange={v => update('latitude', v)} />
        <Field label="LONGITUDE" value={settings.longitude} onChange={v => update('longitude', v)} />
        <Field label="GOOGLE REVIEW URL" value={settings.google_review_url} onChange={v => update('google_review_url', v)} full />
        <Field label="HERO IMAGE URL" value={settings.hero_image} onChange={v => update('hero_image', v)} full />
        <Field label="LOGO URL" value={settings.logo_url} onChange={v => update('logo_url', v)} full />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, full }: { label: string; value: string; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-xs font-semibold tracking-widest text-foreground">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
    </div>
  );
}
