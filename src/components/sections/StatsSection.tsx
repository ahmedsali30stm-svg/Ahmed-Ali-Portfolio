"use client";

import { useGsapCounter } from "@/hooks/use-gsap-counter";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const stats = [
  { value: "300", suffix: "+", label: "Corporate Accounts" },
  { value: "16", prefix: "SAR ", suffix: "M+", label: "Annual Sales" },
  { value: "50", suffix: "+", label: "Hotel Partners" },
  { value: "5", suffix: "", label: "Team Members" },
];

export function StatsSection() {
  const counterRef = useGsapCounter({ duration: 2, delay: 0.2 });
  const gridRef = useGsapReveal({ y: 30, duration: 0.8 });

  return (
    <section id="stats" className="relative py-24 px-6 z-10">
      <div className="max-w-6xl mx-auto" ref={gridRef}>
        <div ref={counterRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2"
                data-count={`${stat.prefix || ""}${stat.value}${stat.suffix}`}
              >
                {`${stat.prefix || ""}0${stat.suffix}`}
              </div>
              <div className="text-sm text-[var(--text-muted)] tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
