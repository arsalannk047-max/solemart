'use client';
import { useEffect, useRef, useState } from 'react';

const WORD = 'SOLEMART';
const SOLE_LEN = 4; // "SOLE" is white, "MART" is volt — matches the site wordmark

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState('mark'); // 'mark' -> 'letters'
  const [skip, setSkip] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (started.current) return;
    started.current = true;
    if (sessionStorage.getItem('solemart_intro_seen')) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem('solemart_intro_seen', '1');
    setTimeout(() => setPhase('letters'), 950);
    // No crossfade — the splash stays fully solid and disappears in one clean cut,
    // so the site is never visible underneath while it's still showing.
    setTimeout(() => setVisible(false), 2700);
  }, []);

  if (skip || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        background: '#0a0b0d',
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(198,255,77,0.12) 0%, rgba(10,11,13,1) 60%)'
      }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-6">
          <div
            className={`absolute inset-0 rounded-full border-[3px] border-volt/20 border-t-volt transition-opacity duration-300 ${
              phase === 'mark' ? 'opacity-100 animate-spin intro-ring-glow' : 'opacity-0'
            }`}
            style={{ animationDuration: '1000ms' }}
          />
          <div
            className={`absolute inset-[10px] rounded-2xl bg-[#15161A] border border-white/10 flex items-center justify-center transition-transform duration-500 ${
              phase === 'mark' ? 'scale-100 intro-pulse' : 'scale-90'
            }`}
          >
            <span className="font-display text-3xl text-volt intro-mark-glow">S</span>
          </div>
        </div>

        <div className="font-display text-3xl md:text-4xl tracking-wide flex h-10">
          {phase === 'letters' &&
            WORD.split('').map((ch, i) => (
              <span
                key={i}
                className={`intro-letter ${i >= SOLE_LEN ? 'intro-letter-volt' : ''}`}
                style={{
                  color: i < SOLE_LEN ? '#fff' : '#C6FF4D',
                  animationDelay: `${i * 65}ms`
                }}
              >
                {ch}
              </span>
            ))}
        </div>
      </div>

      <style jsx>{`
        .intro-pulse {
          animation: introPulse 1.4s ease-in-out infinite;
        }
        @keyframes introPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(198, 255, 77, 0.25); }
          50% { box-shadow: 0 0 0 12px rgba(198, 255, 77, 0); }
        }
        .intro-ring-glow {
          filter: drop-shadow(0 0 8px rgba(198, 255, 77, 0.55));
        }
        .intro-mark-glow {
          text-shadow: 0 0 12px rgba(198, 255, 77, 0.65), 0 0 24px rgba(198, 255, 77, 0.3);
        }
        .intro-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(14px);
          animation: introLetterIn 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .intro-letter-volt {
          text-shadow: 0 0 10px rgba(198, 255, 77, 0.7), 0 0 22px rgba(198, 255, 77, 0.35);
        }
        @keyframes introLetterIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}