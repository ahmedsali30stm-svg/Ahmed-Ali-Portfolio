"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate counter from 0 → 100
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(obj.val));
        if (progressRef.current) {
          progressRef.current.style.width = `${obj.val}%`;
        }
      },
    });

    // Fade out logo + counter
    tl.to(
      [logoRef.current, counterRef.current, progressRef.current?.parentElement],
      {
        opacity: 0,
        y: -15,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.in",
      },
      "-=0.3"
    );

    // Split-screen reveal — top slides up, bottom slides down
    tl.to(
      topRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
      },
      "-=0.1"
    );
    tl.to(
      bottomRef.current,
      {
        yPercent: 100,
        duration: 0.8,
        ease: "power3.inOut",
      },
      "<"
    );

    // Fire onComplete
    tl.call(onComplete);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-none"
    >
      {/* Top half */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[var(--bg-primary)]"
        style={{ zIndex: 10001 }}
      />
      {/* Bottom half */}
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--bg-primary)]"
        style={{ zIndex: 10001 }}
      />

      {/* Content centered over both halves */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 10002 }}
      >
        {/* Geometric logo mark */}
        <div ref={logoRef} className="mb-8">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="4"
              width="40"
              height="40"
              rx="2"
              stroke="#d4af37"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <rect
              x="12"
              y="12"
              width="24"
              height="24"
              rx="1"
              stroke="#d4af37"
              strokeWidth="1"
              opacity="0.6"
            />
            <rect
              x="18"
              y="18"
              width="12"
              height="12"
              fill="#d4af37"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Counter */}
        <div
          ref={counterRef}
          className="font-[var(--font-heading)] text-5xl md:text-7xl font-bold text-[var(--accent)] tabular-nums"
        >
          {String(count).padStart(3, "0")}
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-48 h-[1px] bg-[rgba(255,255,255,0.06)] relative">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 bg-[var(--accent)]"
            style={{ width: "0%" }}
          />
        </div>

        <div className="mt-4 text-xs tracking-[0.3em] uppercase text-[var(--text-muted)]">
          Loading
        </div>
      </div>
    </div>
  );
}
