'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/admin/dashboard');
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error('Invalid credentials. Please try again.');
      return;
    }
    toast.success('Welcome back!');
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            The Rushers Cafe
          </h1>
          <p className="mt-2 text-xs font-medium tracking-[0.3em] text-gold">ADMIN PANEL</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-3 pl-10 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="admin@emberandbean.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-foreground">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-none border border-border bg-secondary/50 px-3 py-3 pl-10 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> SIGNING IN...</> : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          Authorized personnel only. Create an account via Supabase to access the dashboard.
        </p>
      </div>
    </div>
  );
}
