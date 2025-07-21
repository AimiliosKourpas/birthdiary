'use client';

import React from 'react';

const ConfettiBackground = () => {
  const confettiCount = typeof window !== 'undefined' && window.innerWidth > 768 ? 80 : 30;

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(confettiCount)].map((_, i) => {
          const hue = Math.floor(Math.random() * 360);
          const left = Math.random() * 100; // % of screen width
          const delay = Math.random() * 5;
          const size = 6 + Math.random() * 6;
          const rotate = Math.random() * 360;

          return (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `hsl(${hue}, 70%, 80%)`,
                transform: `rotate(${rotate}deg)`,
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        .confetti {
          position: absolute;
          top: -10px;
          border-radius: 2px;
          opacity: 0.8;
          animation: fall 6s linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ConfettiBackground;
