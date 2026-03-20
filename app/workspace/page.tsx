'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import WorkspaceNavbar from '@/components/workspace-navbar';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

export default function WorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#171717' }}>
        <p className="text-white/30 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  const handleSend = (message: string, files?: File[]) => {
    console.log('Message:', message, 'Files:', files);
  };

  return (
    <main className="min-h-screen pb-36" style={{ backgroundColor: '#171717' }}>
      <WorkspaceNavbar />



      {/* Fixed Prompt Bar */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4" style={{ background: 'linear-gradient(to top, #171717 60%, transparent)' }}>
        <div className="max-w-3xl mx-auto">
          <PromptInputBox
            onSend={handleSend}
            placeholder="Describe the BGM you want to generate..."
          />
        </div>
      </div>
    </main>
  );
}
