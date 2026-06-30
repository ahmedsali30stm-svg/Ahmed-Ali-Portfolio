"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const categories = [
  {
    title: "Languages & Frameworks",
    items: [
      "Python", "TypeScript", "JavaScript", "React", "Next.js",
      "Node.js", "FastAPI", "Flask", "Express.js", "Tailwind CSS",
      "HTML5/CSS3", "React Native", "Kotlin",
    ],
  },
  {
    title: "AI / ML",
    items: [
      "LangChain", "OpenAI API", "GPT-4", "Claude", "Gemini",
      "RAG", "Vector Databases", "Pinecone", "FAISS", "Hugging Face",
      "LangGraph", "AutoGen",
    ],
  },
  {
    title: "Databases & Cloud",
    items: [
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
      "Supabase", "Google Cloud", "AWS", "Docker", "Git",
    ],
  },
  {
    title: "Tools & Integrations",
    items: [
      "WhatsApp Business API", "Stripe", "PayPal", "Google Maps",
      "Amadeus", "Midtrans", "Xero", "QuickBooks", "Jira", "Figma",
    ],
  },
];

export function TechStackSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative py-32 px-6 z-10">
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
            Tech Stack
          </span>
        </motion.div>

        <motion.h2
          initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-16 leading-tight"
        >
          Tools & <span className="text-[var(--accent)]">Technologies</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
              className="p-8 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] backdrop-blur-sm"
            >
              <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--accent)] mb-5">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-glass)]
                               text-[var(--text-secondary)] hover:border-[var(--border-hover)]
                               hover:text-[var(--accent)] transition-all duration-300 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
