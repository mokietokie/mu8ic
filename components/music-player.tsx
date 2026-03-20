'use client';

import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { MusicTrack } from './music-list';

interface MusicPlayerProps {
  track: MusicTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  hasPrev,
  hasNext,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
}: MusicPlayerProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ backgroundColor: '#0f0f0f', borderTop: '1px solid #1e1e1e' }}
    >
      {/* Seekable progress bar */}
      <div
        className="relative h-[3px] group"
        style={{ backgroundColor: '#252525' }}
      >
        <div
          className="absolute inset-y-0 left-0 pointer-events-none transition-all duration-100"
          style={{ width: `${progress}%`, backgroundColor: '#ffffff' }}
        />
        {/* Invisible range input for interaction */}
        <input
          type="range"
          min={0}
          max={Math.ceil(duration) || 1}
          step={1}
          value={Math.floor(currentTime)}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '100%' }}
        />
      </div>

      {/* Player body */}
      <div className="flex items-center gap-4 px-5 h-[62px]">

        {/* Left — Track info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <rect x="0"   y="4"  width="2" height="4"  rx="1" fill="rgba(255,255,255,0.35)" />
              <rect x="3"   y="1"  width="2" height="10" rx="1" fill="rgba(255,255,255,0.55)" />
              <rect x="6"   y="0"  width="2" height="12" rx="1" fill="rgba(255,255,255,0.75)" />
              <rect x="9"   y="2"  width="2" height="8"  rx="1" fill="rgba(255,255,255,0.55)" />
              <rect x="12"  y="4"  width="2" height="4"  rx="1" fill="rgba(255,255,255,0.35)" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-white/85 truncate leading-tight font-medium">
              {track.title || track.prompt}
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">
              {formatTime(currentTime)}&nbsp;/&nbsp;{formatTime(duration)}
            </p>
          </div>
        </div>

        {/* Center — Controls */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: hasPrev ? 'rgba(255,255,255,0.6)' : undefined }}
            onMouseEnter={(e) => { if (hasPrev) e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = hasPrev ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'; }}
          >
            <SkipBack className="w-[15px] h-[15px]" fill="currentColor" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#ffffff' }}
          >
            {isPlaying ? (
              <Pause className="w-[14px] h-[14px] text-black" fill="black" />
            ) : (
              <Play className="w-[14px] h-[14px] text-black ml-0.5" fill="black" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: hasNext ? 'rgba(255,255,255,0.6)' : undefined }}
            onMouseEnter={(e) => { if (hasNext) e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = hasNext ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'; }}
          >
            <SkipForward className="w-[15px] h-[15px]" fill="currentColor" />
          </button>
        </div>

        {/* Right — spacer to balance left */}
        <div className="flex-1" />
      </div>
    </div>
  );
}
