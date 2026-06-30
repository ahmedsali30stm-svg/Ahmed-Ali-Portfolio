"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const projects = [
  {
    title: "Etlaala OTA Platform",
    subtitle: "Full-Stack Travel Ecosystem",
    tech: ["React", "Node.js", "AI/ML", "PostgreSQL", "Redis"],
    desc: "Complete OTA platform with autonomous booking, dynamic pricing, real-time inventory sync, and AI-driven customer support. Serves 300+ corporate accounts across Saudi Arabia, Egypt, and Indonesia.",
    metrics: "SAR 16M+ Revenue",
    link: "https://etlaala.com",
  },
  {
    title: "Multi-Agent AI Orchestration",
    subtitle: "Intelligent Automation Engine",
    tech: ["Python", "LangChain", "GPT-4", "FastAPI", "Docker"],
    desc: "Autonomous multi-agent system for end-to-end travel operations — reservations, invoicing, visa processing, supplier management, and client communications. Replaces 5+ manual workflows.",
    metrics: "90% Automation",
    link: "#",
  },
  {
    title: "Dynamic Pricing Engine",
    subtitle: "Real-Time Revenue Optimization",
    tech: ["Python", "TensorFlow", "Redis", "PostgreSQL", "REST APIs"],
    desc: "Machine learning-powered pricing engine processing 50,000+ daily rate comparisons across hotels, flights, and packages. Adjusts pricing in real-time based on demand, seasonality, and competitor analysis.",
    metrics: "23% Revenue Increase",
    link: "#",
  },
  {
    title: "AI Customer Support System",
    subtitle: "Intelligent Client Communication",
    tech: ["GPT-4", "RAG", "Vector DB", "Node.js", "React"],
    desc: "AI-powered customer support handling 80%+ of inquiries autonomously. Multilingual (Arabic/English), context-aware, with seamless human escalation for complex cases.",
    metrics: "80% Self-Service",
    link: "#",
  },
  {
    title: "CRM & Sales Pipeline",
    subtitle: "B2B Travel Management",
    tech: ["React", "Node.js", "PostgreSQL", "Redis", "Charts.js"],
    desc: "Intelligent CRM system tracking 300+ corporate accounts with AI-driven lead scoring, automated follow-ups, and real-time sales analytics dashboards.",
    metrics: "300+ Accounts",
    link: "#",
  },
  {
    title: "Real-Time Analytics Dashboard",
    subtitle: "Business Intelligence Platform",
    tech: ["React", "D3.js", "WebSocket", "Node.js", "Redis"],
    desc: "Live analytics dashboard providing real-time insights across bookings, revenue, supplier performance, and customer behavior. Custom report generation and anomaly detection.",
    metrics: "50K+ Daily Events",
    link: "#",
  },
];

export function ProjectsSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="projects" className="relative py-32 px-6 z-10">
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
            Projects
          </span>
        </motion.div>

        <motion.h2
          initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-16 leading-tight"
        >
          Selected <span className="text-[var(--accent)]">Work</span>
        </motion.h2>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <motion.a
              key={i}
              href={project.link}
              target={project.link !== "#" ? "_blank" : undefined}
              rel={project.link !== "#" ? "noopener noreferrer" : undefined}
              initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group block p-8 md:p-10 rounded-2xl
                         bg-[var(--bg-glass)] border border-[var(--border-glass)]
                         backdrop-blur-sm
                         hover:border-[var(--border-hover)]
                         transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--accent)] mt-1">{project.subtitle}</p>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-xs rounded-full border border-[var(--border-glass)] text-[var(--text-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:text-right shrink-0">
                  <span className="text-sm font-[var(--font-heading)] font-semibold text-[var(--accent)]">
                    {project.metrics}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
