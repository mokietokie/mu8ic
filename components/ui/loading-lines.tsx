'use client';

import React from 'react';

const LoadingLines: React.FC = () => {
  const letters = 'Loading'.split('');

  return (
    <div className="relative flex items-center justify-center h-[60px] w-auto font-semibold select-none text-white scale-[1]">
      {letters.map((letter, idx) => (
        <span
          key={idx}
          className="relative inline-block opacity-0 z-[2] text-white/80 text-sm tracking-widest"
          style={{
            animation: 'llLetterAnim 4s linear infinite',
            animationDelay: `${0.1 + idx * 0.105}s`,
          }}
        >
          {letter}
        </span>
      ))}

      <div className="absolute top-0 left-0 w-full h-full z-[1] bg-transparent [mask:repeating-linear-gradient(90deg,transparent_0,transparent_6px,black_7px,black_8px)]">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: [
              'radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%)',
              'radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%)',
              'radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%)',
              'radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%)',
              'radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%)',
            ].join(','),
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)',
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)',
            animation: 'llTransformAnim 2s infinite alternate cubic-bezier(0.6,0.8,0.5,1), llOpacityAnim 4s infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes llTransformAnim {
          0% { transform: translate(-55%); }
          100% { transform: translate(55%); }
        }
        @keyframes llOpacityAnim {
          0%, 100% { opacity: 0; }
          15% { opacity: 1; }
          65% { opacity: 0; }
        }
        @keyframes llLetterAnim {
          0% { opacity: 0; }
          5% { opacity: 1; text-shadow: 0 0 4px #fff; transform: scale(1.1) translateY(-2px); }
          20% { opacity: 0.2; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingLines;
