'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';

import WorkspaceNavbar from '@/components/workspace-navbar';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import MusicList, { type MusicTrack } from '@/components/music-list';
import MusicPlayer from '@/components/music-player';

export default function WorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio player state
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef<MusicTrack[]>([]);

  // Keep tracksRef in sync so audio callbacks can access latest tracks
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  // Load existing completed tracks
  useEffect(() => {
    if (!user) return;
    supabase
      .from('musics')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setTracks(data as MusicTrack[]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#171717' }}>
        <p className="text-white/30 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  // ── Audio controls ──────────────────────────────────────────
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playTrack = async (track: MusicTrack) => {
    // Same track → toggle play/pause
    if (activeTrackId === track.id) {
      togglePlayPause();
      return;
    }

    // Get signed URL (use cached or fetch fresh)
    let url = track.playUrl;
    if (!url && track.file_path) {
      const { data } = await supabase.storage
        .from('musics')
        .createSignedUrl(track.file_path, 3600);
      url = data?.signedUrl ?? undefined;
      if (url) {
        setTracks((prev) => prev.map((t) => t.id === track.id ? { ...t, playUrl: url } : t));
        tracksRef.current = tracksRef.current.map((t) => t.id === track.id ? { ...t, playUrl: url } : t);
      }
    }
    if (!url) return;

    // Tear down previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.ondurationchange = null;
      audioRef.current.onended = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.ondurationchange = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    audio.onended = () => {
      const list = tracksRef.current;
      const idx = list.findIndex((t) => t.id === track.id);
      if (idx >= 0 && idx < list.length - 1) {
        playTrack(list[idx + 1]);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.play();
    setActiveTrackId(track.id);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const activeIndex = tracks.findIndex((t) => t.id === activeTrackId);

  const filteredTracks = searchQuery.trim()
    ? tracks.filter((t) =>
        (t.title || t.prompt).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tracks;

  const playNext = () => {
    if (activeIndex >= 0 && activeIndex < tracks.length - 1) {
      playTrack(tracks[activeIndex + 1]);
    }
  };

  const playPrev = () => {
    // If > 3s in, restart; else go to previous
    if (currentTime > 3) {
      seek(0);
    } else if (activeIndex > 0) {
      playTrack(tracks[activeIndex - 1]);
    }
  };

  // ── Generation ───────────────────────────────────────────────
  const handleSend = async (message: string) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.detail ?? data.error ?? 'Generation failed');
        setIsGenerating(false);
        return;
      }

      const { predictionId, musicId } = data;

      const poll = async () => {
        try {
          const statusRes = await fetch(`/api/music-status/${predictionId}?musicId=${musicId}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'completed') {
            const newTrack: MusicTrack = { ...statusData.music, playUrl: statusData.url };
            setTracks((prev) => [newTrack, ...prev]);
            setIsGenerating(false);
            playTrack(newTrack); // auto-play on finish
          } else if (statusData.status === 'failed') {
            setErrorMsg(statusData.error ?? 'Generation failed');
            setIsGenerating(false);
          } else {
            setTimeout(poll, 3000);
          }
        } catch {
          setErrorMsg('Network error while checking status.');
          setIsGenerating(false);
        }
      };

      setTimeout(poll, 5000);
    } catch {
      setErrorMsg('Network error. Please try again.');
      setIsGenerating(false);
    }
  };

  const hasPlayer = !!activeTrackId;
  const activeTrack = tracks.find((t) => t.id === activeTrackId) ?? null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: '#171717', paddingBottom: hasPlayer ? '200px' : '160px' }}
    >
      <WorkspaceNavbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <div className="flex items-start justify-center pt-10">
        <MusicList
          tracks={filteredTracks}
          playingId={activeTrackId}
          isPlaying={isPlaying}
          isGenerating={isGenerating}
          errorMsg={errorMsg}
          onPlay={playTrack}
          onErrorDismiss={() => setErrorMsg(null)}
        />
      </div>

      {/* Prompt Box — sits above player when player is visible */}
      <div
        className="fixed left-0 right-0 px-6 pb-6 pt-8"
        style={{
          bottom: hasPlayer ? '65px' : '0px',
          background: 'linear-gradient(to top, #171717 65%, transparent)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <PromptInputBox
            onSend={handleSend}
            isLoading={isGenerating}
            placeholder="Describe the BGM you want to generate..."
          />
        </div>
      </div>

      {/* Music Player */}
      {hasPlayer && activeTrack && (
        <MusicPlayer
          track={activeTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          hasPrev={activeIndex > 0}
          hasNext={activeIndex < tracks.length - 1}
          onPlayPause={togglePlayPause}
          onPrev={playPrev}
          onNext={playNext}
          onSeek={seek}
        />
      )}
    </main>
  );
}

