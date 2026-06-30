# Volume 9 — AI Integration

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> How the AI navigation assistant works, how to upgrade it to a real LLM, and the architecture for future AI features.

---

## Table of Contents

1. [Current AI System](#1-current-ai-system)
2. [Command Router Architecture](#2-command-router-architecture)
3. [LLM Swap Guide](#3-llm-swap-guide)
4. [Future AI Features](#4-future-ai-features)

---

## 1. Current AI System

The portfolio's AI assistant is a **command router** — a pattern-matching system that maps user input to predefined responses and navigation actions.

### Capabilities

| Capability | Status | Implementation |
|-----------|--------|----------------|
| Navigation | Working | `scrollToSection()` on match |
| Knowledge responses | Working | Predefined text responses |
| Typing simulation | Working | `setTimeout(600–1400ms)` |
| Quick commands | Working | Chip buttons auto-send |
| Rich text | Working | `**bold**` markdown rendering |
| Real LLM | Not implemented | Architecture ready |

### Response Flow

```
User input
    ↓
resolveResponse(input)
    ↓
Match against COMMANDS patterns
    ↓
Return { content, navigation? }
    ↓
Display response
    ↓
Execute navigation (if present)
```

---

## 2. Command Router Architecture

### Data Structure

```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  navigation?: { target: string; label: string };
}

interface CommandMatch {
  patterns: RegExp[];
  response: string;
  navigation?: { target: string; label: string };
}
```

### COMMANDS Array

11 command categories, each with 1–3 regex patterns:

| Category | Patterns | Response | Navigation |
|----------|----------|----------|------------|
| Projects | `project\|work\|built\|portfolio\|show.*work` | "Navigating to Projects..." | `#projects` |
| About | `about\|who.*ahmed\|tell.*about\|background` | "Navigating to About..." | `#about` |
| Expertise | `expertise\|skill\|competenc\|capabilities` | "Navigating to Expertise..." | `#expertise` |
| Stats | `stat\|number\|metric\|account\|revenue` | "Navigating to Stats..." | `#stats` |
| Contact | `contact\|reach\|email\|hire\|linkedin` | "Navigating to Contact..." | `#contact` |
| Testimonials | `testimonial\|review\|feedback` | "Navigating to Testimonials..." | `#testimonials` |
| Tech Stack | `tech.*stack\|tool\|technology\|framework` | "Navigating to Tech Stack..." | `#techstack` |
| Hello | `hello\|hi\|hey\|greetings` | Knowledge response | — |
| Who Are You | `who.*are.*you\|your.*name` | Knowledge response | — |
| What Does Ahmed Do | `what.*do.*ahmed\|role\|job` | Knowledge response | — |
| Etlaala | `etlaala\|company\|travel.*company` | Knowledge response | — |
| Projects Detail | `project\|ota\|pricing\|agent` | Knowledge response | — |
| Tech Detail | `tech.*stack\|python\|react\|next` | Knowledge response | — |
| Architecture | `how.*built\|architecture\|system.*design` | Knowledge response | — |
| Thanks | `thank\|thanks\|thx` | Knowledge response | — |

### Response Resolution

```typescript
function resolveResponse(input: string): {
  content: string;
  navigation?: { target: string; label: string };
} {
  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(trimmed)) {
        return { content: cmd.response, navigation: cmd.navigation };
      }
    }
  }
  return { content: FALLBACK };
}
```

### Scroll Navigation

```typescript
function scrollToSection(targetId: string) {
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
```

---

## 3. LLM Swap Guide

### Architecture for Real LLM Integration

The `resolveResponse` function is designed as a **drop-in swap point**. To integrate a real LLM:

### Step 1: Create API Route

```typescript
// src/app/api/chat/route.ts (requires server mode, not static export)
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Ahmed Ali's portfolio assistant. You help visitors navigate the portfolio and answer questions about Ahmed's work. Keep responses concise. When the user wants to navigate, respond with a JSON object: { "content": "your response", "navigation": { "target": "section-id", "label": "Section Name" } }`,
        },
        ...messages,
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ content: data.choices[0].message.content });
}
```

### Step 2: Update AIChatAssistant

Replace `resolveResponse(text)` with:

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  }),
});
const { content, navigation } = await response.json();
```

### Step 3: Switch to Server Mode

Change `next.config.ts`:
```typescript
// Remove: output: "export"
// Remove: basePath (unless using a subdirectory)
```

**Note:** This requires a Node.js server (Vercel, Railway, etc.) — GitHub Pages won't work.

### Fallback: Client-Side LLM

For static hosting, use a client-side approach:

```typescript
// Use a free LLM API or OpenAI client-side
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
  },
  body: JSON.stringify({ ... }),
});
```

**Security note:** Client-side API keys are visible to users. Use a proxy or edge function.

---

## 4. Future AI Features

### Potential Upgrades

| Feature | Difficulty | Impact |
|---------|-----------|--------|
| Real LLM responses | Medium | High |
| Conversation memory | Low | Medium |
| Multi-language (AR/EN) | Medium | High |
| Voice input | High | Medium |
| Proactive suggestions | Medium | Low |
| Sentiment analysis | High | Low |

### Conversation Memory

Add to state:
```typescript
const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

// Include history in API call
const response = await fetch("/api/chat", {
  body: JSON.stringify({
    messages: conversationHistory.map(m => ({
      role: m.role,
      content: m.content,
    })),
  }),
});
```

### Multi-Language Support

Add language detection:
```typescript
const isArabic = /[\u0600-\u06FF]/.test(text);
const systemPrompt = isArabic
  ? "You are Ahmed Ali's portfolio assistant. Respond in Arabic."
  : "You are Ahmed Ali's portfolio assistant. Respond in English.";
```

---

*End of Volume 9 — AI Integration*
*Total: ~300 lines, ~7 pages*
