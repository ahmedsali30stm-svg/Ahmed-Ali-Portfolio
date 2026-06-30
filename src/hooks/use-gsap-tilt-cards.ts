"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TiltCardsOptions {
  start?: string;
  stagger?: number;
}

export function useGsapTiltCards(options: TiltCardsOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const { start = "top 85%", stagger = 0.1 } = options;

    const cards = el.querySelectorAll("[data-tilt-card]");
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 50, rotateX: 8, transformPerspective: 800 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}
