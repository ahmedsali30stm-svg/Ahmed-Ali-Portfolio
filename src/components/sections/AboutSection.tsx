"use client";

import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const timeline = [
  {
    period: "Present",
    title: "Founder & AI Systems Architect",
    org: "Etlaala Travel & Tourism",
    desc: "Building autonomous AI-first travel ecosystems. Architecture, automation, and full-stack development across Egypt and the GCC.",
  },
  {
    period: "2022 — 2023",
    title: "Senior B2B Travel Tech Agent",
    org: "Etlaala — Mecca, Saudi Arabia",
    desc: "Led AI strategy for B2B operations. Built intelligent automation across reservations, invoicing, visa processing, and supplier management.",
  },
  {
    period: "2021 — 2022",
    title: "Business Development Manager",
    org: "Etlaala — Mecca",
    desc: "Grew B2B luxury travel from 50 to 300+ corporate accounts. Drove SAR 16M+ in annual corporate travel sales.",
  },
  {
    period: "2019 — 2021",
    title: "Senior Travel Consultant",
    org: "Etlaala — Mecca",
    desc: "Delivered premium Umrah & Hajj, honeymoon, and corporate travel experiences. Built supplier relationships across 3 continents.",
  },
  {
    period: "2018 — 2019",
    title: "Travel Operations Specialist",
    org: "Etlaala — Mecca",
    desc: "Managed end-to-end operations: bookings, visa processing, hotel & flight reservations. Maintained 98%+ client satisfaction.",
  },
];

export function AboutSection() {
  const labelRef = useGsapReveal({ x: -30, duration: 0.7 });
  const headingRef = useGsapReveal({ y: 40, duration: 0.8, delay: 0.1 });
  const bioRef = useGsapReveal({ y: 30, duration: 0.8, delay: 0.2 });
  const timelineRef = useGsapReveal({ y: 40, duration: 0.9, delay: 0.1 });

  return (
    <section id="about" className="relative py-32 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div ref={labelRef} className="flex items-center gap-3 mb-6 opacity-0">
          <span className="w-12 h-[1px] bg-[var(--accent)]" />
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            About
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-[var(--font-heading)] text-4xl md:text-6xl font-bold mb-16 leading-tight opacity-0"
        >
          AI Systems Builder.
          <br />
          <span className="text-[var(--accent)]">Travel Technology Strategist.</span>
        </h2>

        {/* Bio */}
        <div
          ref={bioRef}
          className="grid md:grid-cols-2 gap-12 mb-24 opacity-0"
        >
          <div className="space-y-6 text-[var(--text-secondary)] text-lg leading-relaxed">
            <p>
              Ahmed Ali is an AI Systems Builder and Luxury Travel Technology Strategist who designs and builds end-to-end OTA platforms and intelligent travel ecosystems across Egypt and the GCC.
            </p>
            <p>
              He is the founder of <span className="text-[var(--accent)]">Etlaala Travel & Tourism</span> (إطلالة للسفر و السياحة), a premium travel and tourism company operating across Saudi Arabia, Egypt, and Indonesia with a team of 19+ professionals.
            </p>
          </div>
          <div className="space-y-6 text-[var(--text-secondary)] text-lg leading-relaxed">
            <p>
              Ahmed specializes in building <span className="text-[var(--text-primary)]">autonomous AI-first systems</span> — from dynamic pricing engines and multi-agent orchestration to full-stack web applications with real-time analytics.
            </p>
            <p>
              His approach: eliminate inefficiency, automate the tedious, and build systems that run themselves.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative opacity-0">
          <div className="absolute left-[1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)] via-[var(--border-glass)] to-transparent" />

          <div className="space-y-12" data-timeline-items>
            {timeline.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timeline)[number];
  index: number;
}) {
  const itemRef = useGsapReveal({
    x: -20,
    duration: 0.6,
    delay: index * 0.12,
    start: "top 90%",
  });

  return (
    <div ref={itemRef} className="pl-8 relative opacity-0">
      <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[var(--accent)] -translate-x-[3.5px]" />
      <span className="text-xs tracking-[0.2em] uppercase text-[var(--accent)] font-medium">
        {item.period}
      </span>
      <h3 className="font-[var(--font-heading)] text-xl md:text-2xl font-semibold mt-2 text-[var(--text-primary)]">
        {item.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] mt-1">{item.org}</p>
      <p className="text-[var(--text-secondary)] mt-3 leading-relaxed max-w-2xl">
        {item.desc}
      </p>
    </div>
  );
}
