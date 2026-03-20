'use client';

import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function WorkspaceNavbar() {
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Creator';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4" style={{ background: 'transparent' }}>
      {/* Logo */}
      <span
        className="text-xl font-bold tracking-wider text-white shrink-0"
        style={{ fontFamily: 'var(--font-school-bell)' }}
      >
        mu8ic.
      </span>

      {/* Search Input — Liquid Glass */}
      <div className="flex-1 max-w-sm mx-8">
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-2.5 w-full"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Search your tracks..."
            className="bg-transparent text-sm text-white placeholder:text-white/25 outline-none w-full"
          />
        </div>
      </div>

      {/* Profile Popover */}
      <div className="relative shrink-0 group">
        <div className="cursor-pointer" aria-label="Profile menu">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white/20 transition-all"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white/70 group-hover:ring-2 group-hover:ring-white/20 transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              {displayName[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Popover */}
        <div
          className="absolute right-0 top-8 w-52 rounded-2xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150"
          style={{ paddingTop: '0.75rem' }}
        >
          <div
            className="rounded-2xl py-2"
            style={{
              background: 'rgba(28, 28, 28, 0.85)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
          {/* User info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-white/35 truncate mt-0.5">{user?.email}</p>
          </div>

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors rounded-b-2xl"
          >
            Sign out
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}
