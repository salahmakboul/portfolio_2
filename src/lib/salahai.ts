import { PROJECTS, STACK, JOURNEY, SERVICES, EMAIL, GITHUB_URL } from '@/lib/data'

export type ChipAction =
  | { kind: 'prompt'; value: string }
  | { kind: 'scroll'; value: string }
  | { kind: 'link'; value: string }

export type Chip = { label: string; action: ChipAction }

export type AiReply = { text: string; chips: Chip[] }

const MANIFESTO =
  'I started with a shop page. Eleven months later I was rewriting the Bluetooth audio stack in user-mode C++. I don’t wait for permission from frameworks — when the abstraction leaks, I open the socket. Interfaces should breathe. Software should feel inevitable.'

const PRINCIPLES = [
  { t: 'Open the socket', d: 'Abstractions leak. When they do, he doesn’t patch around them — he rewrites the layer underneath.' },
  { t: 'Motion is meaning', d: 'Animation isn’t decoration. It’s how software tells you what it’s doing, where you are, what comes next.' },
  { t: 'Ship, then sharpen', d: 'A real thing in the world beats a perfect thing in a folder. Every project shipped.' },
]

const norm = (s: string) => s.toLowerCase().trim()

const findProject = (q: string) =>
  PROJECTS.find((p) => {
    const hay = `${p.title} ${p.id} ${p.tagline}`.toLowerCase()
    return q.split(/\s+/).some((w) => w.length > 3 && hay.includes(w))
  })

const SUGGESTIONS: Chip[] = [
  { label: 'What has Salah built?', action: { kind: 'prompt', value: 'What has Salah built?' } },
  { label: 'Show me his strongest project', action: { kind: 'prompt', value: 'Show me his strongest project' } },
  { label: 'How does he approach engineering?', action: { kind: 'prompt', value: 'How does he approach engineering?' } },
  { label: 'Explore his GitHub', action: { kind: 'prompt', value: 'Explore his GitHub' } },
]

function projectsOverview(): AiReply {
  const list = PROJECTS.slice(0, 4)
    .map((p) => `• ${p.title} — ${p.tagline}`)
    .join('\n')
  return {
    text: `Six shipped builds, spanning raw systems work to full-stack apps. A few highlights:\n\n${list}\n\nWant the deep-dive on one of them?`,
    chips: [
      { label: 'Strongest project', action: { kind: 'prompt', value: 'Show me his strongest project' } },
      { label: 'See all in Works', action: { kind: 'scroll', value: '#works' } },
    ],
  }
}

function strongestProject(): AiReply {
  const p = PROJECTS[0]
  return {
    text: `The Virtual A2DP Driver is the one that shows the most range — a Windows Bluetooth audio driver rewritten from scratch in user-mode C++ because the OS driver failed silently. Raw L2CAP sockets, a hand-written AVDTP state machine, an SBC encoder, WASAPI capture — no OS driver involved at all.\n\n"${p.challenges[0]}"`,
    chips: [
      { label: 'Open the project', action: { kind: 'scroll', value: '#works' } },
      { label: 'View repo', action: { kind: 'link', value: p.repo } },
      { label: 'His engineering approach', action: { kind: 'prompt', value: 'How does he approach engineering?' } },
    ],
  }
}

function projectDetail(p: (typeof PROJECTS)[number]): AiReply {
  return {
    text: `${p.title} (${p.year}) — ${p.tagline}\n\n${p.overview}\n\nStack: ${p.stack.join(', ')}. Status: ${p.status}.`,
    chips: [
      { label: 'View repo', action: { kind: 'link', value: p.repo } },
      { label: 'See it in Works', action: { kind: 'scroll', value: '#works' } },
      { label: 'What else did he build?', action: { kind: 'prompt', value: 'What has Salah built?' } },
    ],
  }
}

function engineeringApproach(): AiReply {
  const principles = PRINCIPLES.map((p) => `• ${p.t} — ${p.d}`).join('\n')
  return {
    text: `In his own words: “${MANIFESTO}”\n\nThree principles guide the work:\n\n${principles}`,
    chips: [
      { label: 'Read the manifesto', action: { kind: 'scroll', value: '#manifesto' } },
      { label: 'What has he built?', action: { kind: 'prompt', value: 'What has Salah built?' } },
    ],
  }
}

function githubReply(): AiReply {
  return {
    text: `Salah's GitHub is where the actual code lives — 16 public repos, active weekly. It's the fastest way to see real commits, not just the highlight reel on this page.`,
    chips: [
      { label: 'Open GitHub profile', action: { kind: 'link', value: GITHUB_URL } },
      { label: 'See activity here', action: { kind: 'scroll', value: '#stack' } },
    ],
  }
}

function stackReply(): AiReply {
  const top = [...STACK].sort((a, b) => b.level - a.level).slice(0, 6)
  const list = top.map((s) => `${s.name} (${s.level}%)`).join(', ')
  return {
    text: `Strongest tools right now: ${list}. The range runs from raw systems protocols (L2CAP, AVDTP, WASAPI) to full-stack web (Django, React, WebSockets).`,
    chips: [
      { label: 'See the full arsenal', action: { kind: 'scroll', value: '#stack' } },
      { label: 'What has he built with it?', action: { kind: 'prompt', value: 'What has Salah built?' } },
    ],
  }
}

function journeyReply(): AiReply {
  const first = JOURNEY[0]
  const last = JOURNEY[JOURNEY.length - 1]
  return {
    text: `The timeline runs from "${first.title}" (${first.date}) to "${last.title}" (${last.date}) — eleven months from a hand-rolled shop page to rewriting a Bluetooth audio stack in user-mode C++. Steady escalation, no detours.`,
    chips: [
      { label: 'See the full journey', action: { kind: 'scroll', value: '#journey' } },
      { label: 'His strongest project', action: { kind: 'prompt', value: 'Show me his strongest project' } },
    ],
  }
}

function servicesReply(): AiReply {
  const list = SERVICES.map((s) => `• ${s.title} — ${s.claim}`).join('\n')
  return {
    text: `Where Salah focuses:\n\n${list}`,
    chips: [{ label: 'Get in touch', action: { kind: 'scroll', value: '#contact' } }],
  }
}

function contactReply(): AiReply {
  return {
    text: `Salah is currently accepting select projects. Fastest ways to reach him: email at ${EMAIL}, or straight through GitHub.`,
    chips: [
      { label: 'Open contact form', action: { kind: 'scroll', value: '#contact' } },
      { label: 'Open GitHub', action: { kind: 'link', value: GITHUB_URL } },
    ],
  }
}

function fallback(): AiReply {
  return {
    text: `Not sure I have grounded info on that one — but I know his projects, stack, GitHub activity, timeline and engineering approach in detail. Try one of these:`,
    chips: SUGGESTIONS,
  }
}

export function greeting(): AiReply {
  return {
    text: `Hi — I'm SalahAI, a guide to Salah's work here on the portfolio. Ask me about his projects, stack, GitHub, or how he thinks about engineering.`,
    chips: SUGGESTIONS,
  }
}

export function answer(raw: string): AiReply {
  const q = norm(raw)
  if (!q) return fallback()

  const project = findProject(q)
  if (project && /project|built|build|show|tell|about/.test(q)) return projectDetail(project)
  if (project) return projectDetail(project)

  if (/strongest|best|favorite|favourite|proudest|flagship|impressive/.test(q)) return strongestProject()
  if (/what.*(built|build|made|shipped|projects?)|projects?.*(list|show)/.test(q)) return projectsOverview()
  if (/approach|philosophy|principle|methodology|think(s)? about engineering|engineer(ing)? style/.test(q)) return engineeringApproach()
  if (/github/.test(q)) return githubReply()
  if (/stack|tech(nolog(y|ies))?|language|tool|skill/.test(q)) return stackReply()
  if (/journey|timeline|experience|when.*(start|began)|history|how long/.test(q)) return journeyReply()
  if (/service|offer|help with|hire.*for|available for/.test(q)) return servicesReply()
  if (/contact|hire|email|reach|work with|available/.test(q)) return contactReply()
  if (/^(hi|hey|hello|yo|sup)\b/.test(q)) return greeting()
  if (/who (is|are you)|about salah|about you/.test(q)) return engineeringApproach()

  return fallback()
}
