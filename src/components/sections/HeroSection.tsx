"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const roles = [
  "AI Systems Builder",
  "Luxury Travel Technology Strategist",
  "Sales & Business Growth Leader",
  "Full-Stack Application Architect",
  "Multi-Agent AI Systems Engineer",
];

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 z-10"
    >
      <div className="max-w-5xl mx-auto text-center space-y-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3"
        >
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
          <span className="text-sm tracking-[0.3em] uppercase text-[var(--accent)] font-medium">
            Portfolio
          </span>
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-[var(--font-heading)] text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
        >
          <span className="block text-[var(--text-primary)]">Ahmed</span>
          <span className="block text-[var(--accent)]">Ali</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl text-[var(--text-secondary)] font-light max-w-2xl mx-auto leading-relaxed"
        >
          Building autonomous AI-first travel ecosystems.
          <br />
          <span className="text-[var(--text-muted)]">
            Founder of Etlaala Travel & Tourism — Egypt &amp; GCC
          </span>
        </motion.p>

        {/* Rotating roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {roles.map((role, i) => (
            <motion.span
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="px-4 py-2 rounded-full text-xs md:text-sm tracking-wide
                         border border-[var(--border-glass)]
                         bg-[var(--bg-glass)] text-[var(--text-secondary)]
                         backdrop-blur-sm"
            >
              {role}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
                       overflow-hidden transition-all duration-500
                       bg-[var(--accent)] text-[var(--bg-primary)]
                       hover:shadow-[0_0_30px_var(--accent-glow)]"
          >
            <span className="relative z-10">Get in Touch</span>
          </a>
          <a
            href="#projects"
            className="group px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
                       border border-[var(--border-glass)] text-[var(--text-secondary)]
                       hover:border-[var(--border-hover)] hover:text-[var(--accent)]
                       transition-all duration-500"
          >
            View Projects
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-[var(--accent)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
