"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types — structured for easy LLM API swap later
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  /** When the assistant triggers navigation, this carries the target section */
  navigation?: { target: string; label: string };
}

interface CommandMatch {
  patterns: RegExp[];
  response: string;
  navigation?: { target: string; label: string };
}

// ---------------------------------------------------------------------------
// Command Router — predefined triggers for navigation + knowledge responses
// ---------------------------------------------------------------------------

const COMMANDS: CommandMatch[] = [
  // ── Navigation commands ──────────────────────────────────────────────
  {
    patterns: [/\b(project|work|built|portfolio|show.*work)\b/i],
    response: "Navigating to Projects...",
    navigation: { target: "projects", label: "Projects" },
  },
  {
    patterns: [/\b(about|who.*ahmed|tell.*about|background)\b/i],
    response: "Navigating to About...",
    navigation: { target: "about", label: "About" },
  },
  {
    patterns: [/\b(expertise|skill|competenc|what.*good|capabilities)\b/i],
    response: "Navigating to Expertise...",
    navigation: { target: "expertise", label: "Expertise" },
  },
  {
    patterns: [/\b(stat|number|metric|account|revenue)\b/i],
    response: "Navigating to Stats...",
    navigation: { target: "stats", label: "Stats" },
  },
  {
    patterns: [/\b(contact|reach|email|hire|get.*touch|linkedin)\b/i],
    response: "Navigating to Contact...",
    navigation: { target: "contact", label: "Contact" },
  },
  {
    patterns: [/\b(testimonial|review|what.*say|feedback)\b/i],
    response: "Navigating to Testimonials...",
    navigation: { target: "testimonials", label: "Testimonials" },
  },
  {
    patterns: [/\b(tech.*stack|tool|technology|framework|language)\b/i],
    response: "Navigating to Tech Stack...",
    navigation: { target: "techstack", label: "Tech Stack" },
  },

  // ── Knowledge commands ───────────────────────────────────────────────
  {
    patterns: [/\b(hello|hi|hey|greetings|sup)\b/i],
    response:
      "Hello! I'm Ahmed Ali's AI portfolio assistant. I can navigate you through the site or answer questions about his work.\n\nTry saying **\"show me your work\"** or ask about his **tech stack**.",
  },
  {
    patterns: [/\b(who.*are.*you|what.*are.*you|your.*name)\b/i],
    response:
      "I'm an AI navigation assistant built for Ahmed Ali's portfolio. I can:\n\n• **Navigate** — Say \"projects\", \"about\", or \"contact\" and I'll take you there\n• **Inform** — Ask about Ahmed's skills, projects, or company\n• **Guide** — I know every section of this portfolio\n\nHow can I help?",
  },
  {
    patterns: [/\b(what.*do.*ahmed|ahmed.*do|role|job|position)\b/i],
    response:
      "Ahmed Ali is:\n\n• **AI Systems Builder** — Designing autonomous multi-agent systems\n• **Luxury Travel Technology Strategist** — Building OTA platforms\n• **Founder** of Etlaala Travel & Tourism\n• **Full-Stack Architect** — React, Next.js, Python, Node.js\n\nHe builds end-to-end AI-powered travel ecosystems across Egypt and the GCC.",
  },
  {
    patterns: [/\b(etlaala|company|travel.*company|travel.*tourism)\b/i],
    response:
      "**Etlaala Travel & Tourism** (إطلالة للسفر و السياحة):\n\n• **HQ**: Mecca, Saudi Arabia\n• **Presence**: Saudi Arabia, Egypt, Indonesia\n• **Team**: 19+ professionals\n• **Clients**: 300+ corporate accounts\n• **Revenue**: SAR 16M+ annually\n• **Services**: Hajj & Umrah, luxury travel, corporate travel, visa processing\n\nAhmed built the entire tech stack — OTA platform, AI automation, dynamic pricing.",
  },
  {
    patterns: [/\b(project|ota|pricing|agent|customer.*support)\b/i],
    response:
      "Key projects:\n\n**1. Etlaala OTA Platform**\nFull-stack travel ecosystem — 300+ corporate accounts, SAR 16M+ revenue\n\n**2. Multi-Agent AI Orchestration**\nAutonomous system for reservations, invoicing, visas — 90% automation\n\n**3. Dynamic Pricing Engine**\nML-powered — 50K+ daily rate comparisons, 23% revenue increase\n\n**4. AI Customer Support**\nMultilingual (AR/EN) — handles 80%+ inquiries autonomously\n\nSay **\"projects\"** to scroll to the full showcase.",
  },
  {
    patterns: [/\b(tech.*stack|stack|tool|framework|language|python|react|next)\b/i],
    response:
      "Ahmed's tech stack:\n\n**Languages** — Python, TypeScript, JavaScript\n**Frontend** — React, Next.js, Tailwind CSS\n**Backend** — Node.js, FastAPI, Express.js\n**AI/ML** — LangChain, GPT-4, RAG, Vector DBs\n**Databases** — PostgreSQL, MySQL, MongoDB, Redis\n**Cloud** — Google Cloud, AWS, Docker\n**Travel APIs** — Amadeus, Midtrans\n**Integrations** — WhatsApp Business, Stripe, Xero\n\nSay **\"tech stack\"** to see the full grid.",
  },
  {
    patterns: [/\b(how.*built|architecture|system.*design|how.*work)\b/i],
    response:
      "This portfolio is built with:\n\n• **Next.js 16** — App Router, server components\n• **React Three Fiber** — 3D particle field with custom GLSL shaders\n• **GSAP** — ScrollTrigger animations, magnetic cursor, preloader\n• **Tailwind CSS v4** — Utility-first styling\n• **TypeScript** — Full type safety\n\nThe 3D scene uses 2000 gold particles with simplex noise vertex animation and a bioluminescent fragment shader.",
  },
  {
    patterns: [/\b(thank|thanks|thx|appreciate)\b/i],
    response:
      "You're welcome! Feel free to explore the portfolio or ask anything else about Ahmed's work.",
  },
];

// ---------------------------------------------------------------------------
// Fallback response
// ---------------------------------------------------------------------------

const FALLBACK =
  "I can help you explore Ahmed's portfolio. Try:\n\n• **\"projects\"** — View his work\n• **\"about\"** — Learn his background\n• **\"tech stack\"** — See his tools\n• **\"contact\"** — Get in touch\n• **\"who are you\"** — Learn about Ahmed\n\nWhat would you like to know?";

// ---------------------------------------------------------------------------
// Response resolver — matches input against command patterns
// ---------------------------------------------------------------------------

function resolveResponse(input: string): {
  content: string;
  navigation?: { target: string; label: string };
} {
  const trimmed = input.trim();

  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(trimmed)) {
        return { content: cmd.response, navigation: cmd.navigation };
      }
    }
  }

  return { content: FALLBACK };
}

// ---------------------------------------------------------------------------
// Scroll helper
// ---------------------------------------------------------------------------

function scrollToSection(targetId: string) {
  // Map friendly IDs to actual section IDs used in the DOM
  const idMap: Record<string, string> = {
    stats: "stats",
    techstack: "techstack",
  };

  const id = idMap[targetId] || targetId;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ---------------------------------------------------------------------------
// Unique ID generator
// ---------------------------------------------------------------------------

let _id = 0;
function uid(): string {
  return `msg-${++_id}-${Date.now()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "Welcome. I'm Ahmed Ali's AI navigation assistant. Ask me anything or tell me where to go.\n\nTry: **\"show me your work\"** or **\"what's your tech stack?\"**",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Send handler ─────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay (600–1400ms)
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      const { content, navigation } = resolveResponse(text);

      const aiMsg: Message = {
        id: uid(),
        role: "assistant",
        content,
        timestamp: Date.now(),
        navigation,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // Execute navigation after a brief pause so user can read the response
      if (navigation) {
        setTimeout(() => scrollToSection(navigation.target), 800);
      }
    }, delay);
  }, [input, isTyping]);

  // ── Quick command chips ──────────────────────────────────────────────
  const quickCommands = [
    { label: "Projects", cmd: "show me your work" },
    { label: "About", cmd: "about" },
    { label: "Skills", cmd: "tech stack" },
    { label: "Contact", cmd: "contact" },
  ];

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          FAB — Floating Action Button with glow pulse
          ═══════════════════════════════════════════════════════════════ */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9000] w-14 h-14 rounded-full
                   bg-[var(--accent)] text-[var(--bg-primary)]
                   flex items-center justify-center
                   cursor-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        style={{ boxShadow: "0 0 24px rgba(212,175,55,0.35)" }}
      >
        {/* Glow ring behind button */}
        <span className="absolute inset-0 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-[var(--accent)] opacity-20" />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ═══════════════════════════════════════════════════════════════
          Chat Window — Enterprise Glassmorphism
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[9000]
                       w-[400px] max-w-[calc(100vw-2rem)]
                       flex flex-col
                       rounded-2xl overflow-hidden
                       border border-[rgba(212,175,55,0.12)]
                       shadow-[0_8px_60px_rgba(0,0,0,0.6),0_0_1px_rgba(212,175,55,0.15)]"
            style={{
              background: "rgba(8,8,14,0.88)",
              backdropFilter: "blur(40px) saturate(1.3)",
              WebkitBackdropFilter: "blur(40px) saturate(1.3)",
            }}
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)]">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#b8941e] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                  </svg>
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[rgba(8,8,14,0.88)]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] font-[var(--font-heading)]">
                  Navigator
                </div>
                <div className="text-[11px] text-[var(--accent)] tracking-wide">
                  ONLINE — Ready to assist
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-none"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Quick Commands ──────────────────────────────────────── */}
            <div className="px-5 py-3 flex gap-2 overflow-x-auto border-b border-[rgba(255,255,255,0.03)]">
              {quickCommands.map((qc) => (
                <button
                  key={qc.label}
                  onClick={() => {
                    setInput(qc.cmd);
                    // Auto-send
                    const userMsg: Message = {
                      id: uid(),
                      role: "user",
                      content: qc.cmd,
                      timestamp: Date.now(),
                    };
                    setMessages((prev) => [...prev, userMsg]);
                    setIsTyping(true);
                    setTimeout(() => {
                      const { content, navigation } = resolveResponse(qc.cmd);
                      const aiMsg: Message = {
                        id: uid(),
                        role: "assistant",
                        content,
                        timestamp: Date.now(),
                        navigation,
                      };
                      setMessages((prev) => [...prev, aiMsg]);
                      setIsTyping(false);
                      if (navigation) {
                        setTimeout(() => scrollToSection(navigation.target), 800);
                      }
                    }, 600 + Math.random() * 600);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium
                             border border-[rgba(212,175,55,0.15)]
                             text-[var(--accent)] bg-[rgba(212,175,55,0.04)]
                             hover:bg-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)]
                             transition-all duration-200 cursor-none"
                >
                  {qc.label}
                </button>
              ))}
            </div>

            {/* ── Messages ────────────────────────────────────────────── */}
            <div className="flex-1 h-[380px] overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[#b8941e] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 8V4H8" />
                        <rect width="16" height="12" x="4" y="8" rx="2" />
                      </svg>
                    </div>
                    <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)]">
                      <div className="flex gap-1.5">
                        <TypingDot delay={0} />
                        <TypingDot delay={0.15} />
                        <TypingDot delay={0.3} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEnd} />
            </div>

            {/* ── Input ───────────────────────────────────────────────── */}
            <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.04)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything or say where to go..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm
                             bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                             text-[var(--text-primary)] placeholder-[var(--text-muted)]
                             focus:outline-none focus:border-[rgba(212,175,55,0.3)] focus:bg-[rgba(255,255,255,0.04)]
                             transition-all duration-200 cursor-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold
                             bg-[var(--accent)] text-[var(--bg-primary)]
                             hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                             disabled:opacity-30 disabled:hover:shadow-none
                             transition-all duration-200 cursor-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "items-start gap-2.5"}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[#b8941e] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="3" strokeLinecap="round">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
          </svg>
        </div>
      )}

      <div
        className={`max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "rounded-xl rounded-br-sm bg-[var(--accent)] text-[var(--bg-primary)]"
            : "rounded-xl rounded-tl-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] text-[var(--text-secondary)]"
        }`}
      >
        <RichText content={message.content} />

        {/* Navigation badge */}
        {message.navigation && (
          <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--accent)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Scrolling to {message.navigation.label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** Render **bold** markdown-style text inline */
function RichText({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i) => (
        <span key={i}>
          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-[var(--text-primary)] font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/** Three pulsing dots for typing indicator */
function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}
