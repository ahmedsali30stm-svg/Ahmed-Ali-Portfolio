"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect prefers-reduced-motion and react to changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Hook to detect mobile devices.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setMobile(
        /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth < 768
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
}
