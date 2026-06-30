"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  start?: string;
  toggleActions?: string;
}

export function useGsapReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.9,
      delay = 0,
      ease = "power3.out",
      start = "top 85%",
      toggleActions = "play none none none",
    } = options;

    gsap.set(el, { y, x, opacity });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      toggleActions,
      onEnter: () => {
        gsap.to(el, { y: 0, x: 0, opacity: 1, duration, delay, ease });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}
