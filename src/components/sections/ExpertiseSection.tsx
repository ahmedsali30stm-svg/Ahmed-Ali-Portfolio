"use client";

import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { useGsapTiltCards } from "@/hooks/use-gsap-tilt-cards";

const expertise = [
  {
    icon: "01",
    title: "AI Systems Architecture",
    desc: "Building autonomous multi-agent orchestration engines, intelligent workflow automation, and AI-native systems that replace fragmented tools.",
  },
  {
    icon: "02",
    title: "Travel Technology & OTA Platforms",
    desc: "End-to-end OTA development: dynamic pricing, inventory management, reservation systems, and real-time supplier API integration.",
  },
  {
    icon: "03",
    title: "Full-Stack Application Development",
    desc: "Building complete web applications with React, Next.js, Node.js, Python, and cloud-native architectures. Real-time data, analytics dashboards, and production-ready deployments.",
  },
  {
    icon: "04",
    title: "Business Growth & Sales Strategy",
    desc: "Growing travel operations from 50 to 300+ corporate accounts. SAR 16M+ annual sales. B2B luxury travel, Hajj & Umrah, corporate travel management.",
  },
  {
    icon: "05",
    title: "Intelligent Automation",
    desc: "Automating reservations, invoicing, visa processing, supplier management, and client communications with AI-driven workflows.",
  },
  {
    icon: "06",
    title: "Enterprise System Integration",
    desc: "Building intelligent bridges between fragmented systems — CRM, ERP, booking engines, payment gateways — creating a single source of truth.",
  },
];

export function ExpertiseSection() {
  const labelRef = useGsapReveal({ x: -30, duration: 0.7 });
  const headingRef = useGsapReveal({ y: 40, duration: 0.8, delay: 0.1 });
  const gridRef = useGsapTiltCards({ stagger: 0.1 });

  return (
    <section id="expertise" className="relative py-32 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div ref={labelRef} className="flex items-center gap-3 mb-6 opacity-0">
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            Expertise
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-16 leading-tight opacity-0"
        >
          Core <span className="text-[var(--accent)]">Competencies</span>
        </h2>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {expertise.map((item, i) => (
            <div
              key={i}
              data-tilt-card
              className="group p-8 rounded-2xl
                         bg-[var(--bg-glass)] border border-[var(--border-glass)]
                         backdrop-blur-sm
                         hover:border-[var(--border-hover)]
                         transition-all duration-500 cursor-default"
            >
              <span className="block text-3xl font-[var(--font-heading)] font-bold text-[var(--accent)] mb-4">
                {item.icon}
              </span>
              <h3 className="font-[var(--font-heading)] text-lg font-semibold mb-3 text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
