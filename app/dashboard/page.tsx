'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#171717' }}>
        <p className="text-white/40 text-sm">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#171717' }}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <span
            className="text-2xl font-bold tracking-wider text-white"
            style={{ fontFamily: 'var(--font-school-bell)' }}
          >
            mu8ic.
          </span>
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-white/50">{user.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome, {user.user_metadata?.full_name ?? user.email} 👋
          </h1>
          <p className="text-white/40">Your dashboard is coming soon.</p>
        </div>
      </div>
    </main>
  );
}
