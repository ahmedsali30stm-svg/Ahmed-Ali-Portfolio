"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterOptions {
  start?: string;
  duration?: number;
  delay?: number;
}

export function useGsapCounter(options: CounterOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const { start = "top 80%", duration = 2, delay = 0 } = options;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const valueEls = el.querySelectorAll("[data-count]");
        valueEls.forEach((valueEl, i) => {
          const raw = valueEl.getAttribute("data-count") || "0";
          const numMatch = raw.match(/[\d.]+/);
          const prefix = raw.slice(0, raw.indexOf(numMatch?.[0] || "0"));
          const suffix = raw.slice(
            raw.indexOf(numMatch?.[0] || "0") + (numMatch?.[0]?.length || 0)
          );
          const target = parseFloat(numMatch?.[0] || "0");

          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration,
            delay: delay + i * 0.15,
            ease: "power2.out",
            onUpdate: () => {
              const display =
                target >= 100
                  ? Math.round(obj.val).toLocaleString()
                  : obj.val % 1 === 0
                    ? String(Math.round(obj.val))
                    : obj.val.toFixed(0);
              valueEl.textContent = `${prefix}${display}${suffix}`;
            },
          });
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}
