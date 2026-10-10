'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at || '',
        });
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage admin accounts.</p>

      <div className="mt-6 border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-widest text-foreground">CURRENT ADMIN</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : user ? (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-xs text-muted-foreground">User ID</span>
              <span className="font-mono text-xs text-gold">{user.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Joined</span>
              <span className="text-sm text-foreground">{new Date(user.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No user session found.</p>
        )}
      </div>

      <div className="mt-6 border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-widest text-foreground">ADD NEW ADMIN</h2>
        <p className="mt-3 text-xs text-muted-foreground">
          To add a new admin user, create an account through the Supabase dashboard.
          Only authenticated users can access this admin panel.
        </p>
      </div>
    </div>
  );
}
