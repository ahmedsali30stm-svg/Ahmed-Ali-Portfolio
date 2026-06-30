"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const testimonials = [
  {
    quote:
      "Ahmed transformed our travel operations with AI. What used to take hours now runs autonomously. The OTA platform he built handles everything from pricing to customer support.",
    author: "Etlaala Operations Team",
    role: "Travel Operations",
  },
  {
    quote:
      "The dynamic pricing engine increased our revenue by 23% in the first quarter. Ahmed understands both the technology and the business side better than anyone I've worked with.",
    author: "Etlaala Management",
    role: "Revenue Strategy",
  },
  {
    quote:
      "Ahmed's approach to building systems is different — he doesn't just code, he architects intelligent solutions. Our entire B2B workflow runs on his AI automation now.",
    author: "Etlaala B2B Division",
    role: "B2B Operations",
  },
];

export function TestimonialsSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="testimonials" className="relative py-32 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            Testimonials
          </span>
        </motion.div>

        <motion.h2
          initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-16 leading-tight"
        >
          What <span className="text-[var(--accent)]">They Say</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] backdrop-blur-sm
                         hover:border-[var(--border-hover)] transition-all duration-500"
            >
              <div className="text-4xl text-[var(--accent)] opacity-30 font-serif mb-4">&ldquo;</div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6 italic">
                {t.quote}
              </p>
              <div>
                <div className="font-[var(--font-heading)] font-semibold text-[var(--text-primary)]">
                  {t.author}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
