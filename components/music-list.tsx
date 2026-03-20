'use client';

import { Play, Pause, Music2 } from 'lucide-react';
import LoadingLines from '@/components/ui/loading-lines';

export interface MusicTrack {
  id: string;
  title: string;
  prompt: string;
  file_path: string;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  playUrl?: string;
}

interface MusicListProps {
  tracks: MusicTrack[];
  playingId: string | null;
  isPlaying: boolean;
  isGenerating: boolean;
  errorMsg: string | null;
  onPlay: (track: MusicTrack) => void;
  onErrorDismiss: () => void;
}

export default function MusicList({
  tracks,
  playingId,
  isPlaying,
  isGenerating,
  errorMsg,
  onPlay,
  onErrorDismiss,
}: MusicListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* 생성 중 상태 */}
      {isGenerating && (
        <div className="flex justify-center mb-4">
          <LoadingLines />
        </div>
      )}

      {/* 에러 상태 */}
      {errorMsg && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onErrorDismiss}
            className="flex items-center justify-center w-8 h-8 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: '#2a1a1a', border: '1px solid #5a2a2a' }}
            title={errorMsg}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M13 1L1 13" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* 트랙 목록 */}
      {tracks.length > 0 && (
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 group transition-colors"
              style={{
                backgroundColor: playingId === track.id ? '#222222' : '#1a1a1a',
                border: `1px solid ${playingId === track.id ? '#333333' : '#242424'}`,
              }}
            >
              {/* 트랙 번호 / 재생 버튼 */}
              <div className="w-9 shrink-0 flex items-center justify-center">
                <span
                  className="text-xs text-white/20 group-hover:hidden tabular-nums"
                  style={{ display: playingId === track.id ? 'none' : undefined }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <button
                  onClick={() => onPlay(track)}
                  className="w-9 h-9 rounded-full items-center justify-center shrink-0 transition-all hover:scale-105 hidden group-hover:flex"
                  style={{
                    backgroundColor: playingId === track.id ? '#ffffff' : '#2a2a2a',
                    display: playingId === track.id ? 'flex' : undefined,
                  }}
                >
                  {playingId === track.id && isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white/60 ml-0.5" />
                  )}
                </button>
              </div>

              {/* 트랙 정보 */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm truncate"
                  style={{ color: playingId === track.id ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
                >
                  {track.title || track.prompt}
                </p>
                <p className="text-xs text-white/25 mt-0.5">
                  {new Date(track.created_at).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* 재생 중 인디케이터 */}
              {playingId === track.id ? (
                <div className="flex items-end gap-0.5 h-4 shrink-0">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{
                        backgroundColor: '#ffffff',
                        animation: `musicBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                        height: '100%',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Music2 className="w-4 h-4 text-white/10 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 트랙 없음 */}
      {tracks.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Music2 className="w-8 h-8 text-white/10 mb-4" />
          <p className="text-sm text-white/30">No tracks yet</p>
          <p className="text-xs text-white/20 mt-1">Describe a vibe below to generate your first BGM</p>
        </div>
      )}

      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
