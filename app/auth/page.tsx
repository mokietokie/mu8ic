'use client';

import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: '#171717' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl px-8 py-10 flex flex-col items-center gap-6"
        style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #2a2a2a',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-3xl font-bold tracking-wider text-white"
            style={{ fontFamily: 'var(--font-school-bell)' }}
          >
            mu8ic.
          </span>
          <p className="text-xs text-white/40 tracking-widest uppercase">AI BGM for creators</p>
        </div>

        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Welcome</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to start creating your sound</p>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.611 20.083H42V20H24v8h11.303C33.973 32.443 29.418 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.799 0 5.353 1.057 7.295 2.785l5.657-5.657C33.84 7.346 29.135 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.002 13 24 13c2.799 0 5.353 1.057 7.295 2.785l5.657-5.657C33.84 7.346 29.135 5 24 5c-7.682 0-14.327 4.337-17.694 10.691z" fill="#FF3D00"/>
            <path d="M24 45c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.399 0-9.947-3.447-11.298-8.187l-6.522 5.025C9.505 39.556 16.227 45 24 45z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.012 35.245 44 30.525 44 25c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-white/25 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-white/40 underline cursor-pointer hover:text-white/60 transition-colors">Terms</span>
          {' '}and{' '}
          <span className="text-white/40 underline cursor-pointer hover:text-white/60 transition-colors">Privacy Policy</span>
        </p>
      </div>
    </main>
  );
}
