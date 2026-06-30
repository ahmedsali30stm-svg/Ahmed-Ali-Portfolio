"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ContactSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="contact" className="relative py-32 px-6 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            Contact
          </span>
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
        </motion.div>

        <motion.h2
          initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Let&apos;s <span className="text-[var(--accent)]">Build</span> Together
        </motion.h2>

        <motion.p
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-[var(--text-secondary)] mb-12 max-w-xl mx-auto"
        >
          Ready to build intelligent systems for your travel business?
          Let&apos;s discuss how AI can transform your operations.
        </motion.p>

        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="mailto:info@etlaala.com"
            className="group relative px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
                       overflow-hidden transition-all duration-500
                       bg-[var(--accent)] text-[var(--bg-primary)]
                       hover:shadow-[0_0_30px_var(--accent-glow)]"
          >
            <span className="relative z-10">Email Me</span>
          </a>
          <a
            href="https://linkedin.com/in/the-travel-journey-engineer"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
                       border border-[var(--border-glass)] text-[var(--text-secondary)]
                       hover:border-[var(--border-hover)] hover:text-[var(--accent)]
                       transition-all duration-500"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/ahmedsali30stm-svg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
                       border border-[var(--border-glass)] text-[var(--text-secondary)]
                       hover:border-[var(--border-hover)] hover:text-[var(--accent)]
                       transition-all duration-500"
          >
            GitHub
          </a>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-6 text-sm"
        >
          <div className="p-6 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]">
            <div className="text-[var(--accent)] font-medium mb-1">Location</div>
            <div className="text-[var(--text-secondary)]">Giza, Egypt</div>
          </div>
          <div className="p-6 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]">
            <div className="text-[var(--accent)] font-medium mb-1">Company</div>
            <div className="text-[var(--text-secondary)]">Etlaala Travel & Tourism</div>
          </div>
          <div className="p-6 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]">
            <div className="text-[var(--accent)] font-medium mb-1">Availability</div>
            <div className="text-[var(--text-secondary)]">Open to Opportunities</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
