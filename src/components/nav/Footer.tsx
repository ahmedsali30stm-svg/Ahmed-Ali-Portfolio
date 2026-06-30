"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 z-10 border-t border-[var(--border-glass)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-[var(--font-heading)] text-lg font-bold">
          <span className="text-[var(--accent)]">A</span>
          <span className="text-[var(--text-primary)]">.</span>
        </div>

        <div className="text-sm text-[var(--text-muted)] text-center">
          &copy; {new Date().getFullYear()} Ahmed Ali. All rights reserved.
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/the-travel-journey-engineer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/ahmedsali30stm-svg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm"
          >
            GitHub
          </a>
          <a
            href="https://etlaala.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm"
          >
            Etlaala
          </a>
        </div>
      </div>
    </footer>
  );
}
