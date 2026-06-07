'use client';

import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  hue: number;
  left: number;
  delay: number;
  size: number;
  rotate: number;
}

export default function ConfettiBackground() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const count = window.innerWidth > 768 ? 80 : 30;

    const pieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      hue: Math.floor(Math.random() * 360),
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
    }));

    setConfetti(pieces);
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: `hsl(${piece.hue}, 70%, 80%)`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
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
}