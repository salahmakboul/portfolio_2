export const EMAIL = 'hello@salahmakboul.dev'
export const GITHUB_URL = 'https://github.com/salahmakboul'
export const GITHUB_USER = 'salahmakboul'

export type Project = {
  id: string
  index: string
  title: string
  tagline: string
  year: string
  role: string
  stack: string[]
  repo: string
  live?: string
  cover: 'waves' | 'mesh' | 'cross' | 'radar' | 'crates' | 'orbit'
  accent: string
  overview: string
  features: string[]
  architecture: { title: string; body: string; diagram?: string }
  challenges: string[]
  learned: string[]
  status: string
}

export const PROJECTS: Project[] = [
  {
    id: 'a2dp',
    index: '01',
    title: 'Virtual A2DP Driver',
    tagline: 'Rewriting Windows’ Bluetooth audio stack in user-mode C++',
    year: '2026',
    role: 'Systems Engineer',
    stack: ['C++17', 'WASAPI', 'L2CAP', 'AVDTP', 'SBC', 'RTP', 'CMake'],
    repo: 'https://github.com/salahmakboul/virtual-A2DP-driver',
    cover: 'waves',
    accent: '#4e7aff',
    overview:
      'Windows’ built-in Bluetooth audio driver fails silently on certain headsets — it connects, then produces nothing. Instead of accepting that, this project re-implements the entire A2DP source stack in user-mode: raw L2CAP sockets, the AVDTP signaling state machine, an SBC encoder, and WASAPI loopback capture — feeding PCM straight to the headset with the OS driver completely bypassed.',
    features: [
      'Raw AF_BTH L2CAP sockets — no OS audio driver involved',
      'AVDTP 1.3 signaling state machine written from scratch',
      'SBC encoding wrapped in RTP packets over a dedicated media channel',
      'WASAPI event-driven loopback capture on a Pro Audio thread',
      'Two parallel L2CAP channels: one for control, one for media',
    ],
    architecture: {
      title: 'The pipeline',
      body: 'Two separate L2CAP connections to PSM 0x0019: one carries AVDTP control signaling, the other streams RTP/SBC media. DISCOVER → GET_CAPABILITIES → SET_CONFIGURATION → OPEN → START — then audio flows.',
      diagram: `[PC System Audio]      [Encode]             [Transmit]         [Headset]
┌──────────────┐     ┌──────────────┐     ┌──────────────┐    ┌────────────┐
│ WASAPI       │     │ SBC Encoder  │     │ AVDTP + RTP  │    │ A2DP Sink  │
│ Loopback     │─PCM▶│ 44.1kHz 16b  │─frm▶│ PSM 0x0019   │─L2▶│ Decode+play│
│ Capture      │     │ stereo       │     │ media chan.  │    │            │
└──────────────┘     └──────────────┘     └──────────────┘    └────────────┘`,
    },
    challenges: [
      'The AVDTP state machine is unforgiving — one out-of-order signaling packet and the sink hangs up',
      'SBC frame headers have to be bit-exact; a single wrong bitfield decodes as pure noise',
      'Keeping WASAPI capture, encoding and socket writes in sync without audible drift or buffer underruns',
    ],
    learned: [
      'How Bluetooth audio actually works beneath the driver abstraction',
      'Protocol state machines, bitstream packing, and real-time audio constraints',
      'Reading protocol specs as source code, not documentation',
    ],
    status: 'In active development',
  },
  {
    id: 'fishofisho',
    index: '02',
    title: 'FishoFisho',
    tagline: 'Real-time chat with an AI resident — Discord meets ChatGPT',
    year: '2026',
    role: 'Full-Stack Developer',
    stack: ['Python', 'Django', 'WebSockets', 'JavaScript', 'AI API'],
    repo: 'https://github.com/salahmakboul/FishoFisho-',
    cover: 'mesh',
    accent: '#9d7cff',
    overview:
      'A modern Django chat application with real-time messaging, private conversations, @mentions and notifications — plus an AI assistant that lives inside the chat like another participant. Sleek, responsive, and built to feel instant.',
    features: [
      'Real-time rooms and private conversations over WebSockets',
      'Integrated AI assistant addressable directly in chat',
      '@mentions with live notifications',
      'Responsive, app-grade interface',
    ],
    architecture: {
      title: 'How it fits together',
      body: 'Django serves the application and authentication layer; a WebSocket layer fans messages out to rooms in real time; the AI assistant subscribes to the same message bus, so it can be @mentioned like any human participant.',
    },
    challenges: [
      'Keeping message ordering consistent across concurrent WebSocket consumers',
      'Making the AI feel present — typing states, latency masking, graceful failures',
    ],
    learned: [
      'Real-time architecture with Django beyond request/response',
      'UX patterns for human + AI shared spaces',
    ],
    status: 'Live project',
  },
  {
    id: 'medcare',
    index: '03',
    title: 'MedCare',
    tagline: 'Healthcare appointments without the waiting room',
    year: '2026',
    role: 'Frontend Developer',
    stack: ['React', 'Vite', 'JavaScript', 'CSS'],
    repo: 'https://github.com/salahmakboul/medical-app',
    cover: 'cross',
    accent: '#4de3ff',
    overview:
      'A modern, responsive platform connecting patients with healthcare providers — browse doctors, schedule appointments, and manage care from one clean interface.',
    features: [
      'Doctor discovery with rich profiles',
      'Appointment scheduling flow',
      'Fully responsive patient dashboard',
    ],
    architecture: {
      title: 'Client architecture',
      body: 'Component-driven React SPA bootstrapped with Vite — route-level code splitting, reusable UI primitives, and a predictable state flow for booking journeys.',
    },
    challenges: [
      'Designing a booking flow that stays calm under edge cases — conflicts, cancellations, reschedules',
    ],
    learned: ['Product-minded frontend: forms are where trust is won or lost'],
    status: 'Live project',
  },
  {
    id: 'attacker',
    index: '04',
    title: 'Autonomous Attacker',
    tagline: 'Offensive security research framework',
    year: '2026',
    role: 'Security Researcher',
    stack: ['Python', 'Automation', 'Recon'],
    repo: 'https://github.com/salahmakboul/Autonomous-Attacker-framework',
    cover: 'radar',
    accent: '#ff5d73',
    overview:
      'A Python framework exploring autonomous offensive-security workflows — built to understand how attacks chain together so defenses can be designed with the adversary in mind. Complementary research: deobfuscating commercial bot-detection and fingerprinting scripts.',
    features: [
      'Modular attack-phase orchestration',
      'Research into commercial bot-detector internals',
      'String deobfuscation tooling',
    ],
    architecture: {
      title: 'Design',
      body: 'Pluggable phases — recon, enumeration, exploitation — each an isolated module reporting into a shared knowledge base, so the framework can decide its next move from what it has learned.',
    },
    challenges: [
      'Deobfuscating production fingerprinting scripts built to resist reading',
    ],
    learned: ['You cannot defend what you cannot model — offense teaches defense'],
    status: 'Research',
  },
  {
    id: 'inventory',
    index: '05',
    title: 'Inventory OS',
    tagline: 'Django inventory management with a dashboard pulse',
    year: '2026',
    role: 'Full-Stack Developer',
    stack: ['Python', 'Django', 'Bootstrap', 'SQL'],
    repo: 'https://github.com/salahmakboul/inventory-management',
    cover: 'crates',
    accent: '#ffc857',
    overview:
      'A complete inventory management system — authentication, full CRUD for stock items, categorized organization, and a responsive dashboard that makes stock levels readable at a glance.',
    features: [
      'User authentication and protected routes',
      'Full CRUD with categorized organization',
      'Responsive operations dashboard',
    ],
    architecture: {
      title: 'Classic done right',
      body: 'Django MVT with a relational schema modeled around real warehouse flows — items, categories, stock movements — server-rendered with Bootstrap for speed of delivery.',
    },
    challenges: ['Keeping the dashboard honest: aggregates that stay correct under concurrent edits'],
    learned: ['Boring technology, carefully modeled, beats clever technology'],
    status: 'Complete',
  },
  {
    id: 'shopself',
    index: '06',
    title: 'shopSELF',
    tagline: 'The first build — where it all started',
    year: '2025',
    role: 'Student of the Web',
    stack: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/salahmakboul/shopSELF',
    cover: 'orbit',
    accent: '#7dffca',
    overview:
      'The first e-commerce build — a simple but functional store with product browsing, a cart, and a mock checkout. Small project, enormous lesson: shipping something real is the only teacher that matters.',
    features: ['Product browsing', 'Working cart', 'Mock checkout flow'],
    architecture: {
      title: 'Vanilla everything',
      body: 'Hand-written HTML, CSS and JavaScript. No framework, no build step — just the platform.',
    },
    challenges: ['Everything was new: layout, state, the DOM itself'],
    learned: ['The first ugly ship teaches more than the tenth perfect plan'],
    status: 'Archive — origin story',
  },
]

export type StackItem = {
  name: string
  group: 'Languages' | 'Frameworks' | 'Systems' | 'Tools'
  level: number
  note: string
}

export const STACK: StackItem[] = [
  { name: 'C++17', group: 'Languages', level: 88, note: 'Where the metal lives' },
  { name: 'Python', group: 'Languages', level: 92, note: 'First language, sharpest tool' },
  { name: 'TypeScript', group: 'Languages', level: 84, note: 'Types are documentation that compiles' },
  { name: 'JavaScript', group: 'Languages', level: 90, note: 'The platform, unwrapped' },
  { name: 'HTML / CSS', group: 'Languages', level: 93, note: 'Semantics and pixels' },
  { name: 'Django', group: 'Frameworks', level: 88, note: 'Batteries included, none wasted' },
  { name: 'React', group: 'Frameworks', level: 87, note: 'Interfaces as pure functions' },
  { name: 'Tailwind', group: 'Frameworks', level: 85, note: 'Design at the speed of thought' },
  { name: 'Vite', group: 'Frameworks', level: 82, note: 'The build tool that disappears' },
  { name: 'WASAPI', group: 'Systems', level: 80, note: 'Audio at the OS boundary' },
  { name: 'L2CAP / AVDTP', group: 'Systems', level: 78, note: 'Bluetooth, raw' },
  { name: 'WebSockets', group: 'Systems', level: 86, note: 'Real-time or nothing' },
  { name: 'SBC / RTP', group: 'Systems', level: 74, note: 'Codec frames, packed by hand' },
  { name: 'CMake', group: 'Tools', level: 76, note: 'Builds that build themselves' },
  { name: 'Git', group: 'Tools', level: 90, note: 'History is a superpower' },
  { name: 'Linux', group: 'Tools', level: 83, note: 'Home turf' },
]

export const JOURNEY = [
  {
    date: 'SEP 2025',
    title: 'First lines',
    body: 'shopSELF goes up — a hand-rolled store with a cart and a dream. The bug that bites hardest is the building itself.',
    tag: 'HTML · CSS · JS',
  },
  {
    date: 'JAN 2026',
    title: 'Backend brain',
    body: 'Inventory OS: authentication, CRUD, a dashboard with a pulse. Django becomes the backbone of everything server-side.',
    tag: 'Django · SQL',
  },
  {
    date: 'APR 2026',
    title: 'The automation streak',
    body: 'Three builds in one stretch — an AI IT-support agent, a LinkedIn job-email analyzer, another storefront. Machines that work while you sleep.',
    tag: 'AI Agents · RPA',
  },
  {
    date: 'JUN 2026',
    title: 'Two directions at once',
    body: 'MedCare pushes the frontend craft in React. The Autonomous Attacker framework goes the other way — into offensive security and deobfuscation.',
    tag: 'React · Security',
  },
  {
    date: 'JUL 2026',
    title: 'Down to the metal',
    body: 'Windows’ A2DP driver fails silently on a B203 headset. So: raw L2CAP sockets, a hand-written AVDTP state machine, SBC frames, WASAPI loopback. The whole Bluetooth audio stack, rebuilt in user-mode C++.',
    tag: 'C++17 · Bluetooth · Audio',
  },
]

export const SERVICES = [
  {
    index: '01',
    title: 'Systems Programming',
    claim: 'When the OS says no, I open the socket.',
    body: 'Drivers, protocols, codecs, real-time audio. User-mode C++ that talks to hardware directly — L2CAP sockets, AVDTP state machines, SBC/RTP streams, WASAPI capture. If the abstraction leaks, I rewrite the layer beneath it.',
    tags: ['C++17', 'Bluetooth', 'WASAPI', 'CMake'],
  },
  {
    index: '02',
    title: 'Real-time Web',
    claim: 'Software that answers before you ask.',
    body: 'Django backends with WebSocket layers, React frontends with product-grade polish. Chat systems, dashboards, booking flows — interfaces that stay calm when data moves fast.',
    tags: ['Django', 'React', 'WebSockets', 'REST'],
  },
  {
    index: '03',
    title: 'AI & Automation',
    claim: 'Machines that work while you sleep.',
    body: 'AI agents wired into real products — assistants that live inside chat, IT-support automation, job-market intelligence. RPA pipelines and LLM integrations that do the boring parts flawlessly.',
    tags: ['LLM APIs', 'Agents', 'RPA', 'Python'],
  },
  {
    index: '04',
    title: 'Security Research',
    claim: 'You cannot defend what you cannot model.',
    body: 'Offensive frameworks, bot-detector internals, deobfuscation. Understanding the adversary well enough to design systems that bore them.',
    tags: ['Python', 'Recon', 'Deobfuscation'],
  },
]

export const FALLBACK_STATS = {
  repos: 16,
  followers: 24,
  following: 29,
  since: '2025',
  languages: [
    { name: 'Python', pct: 38, color: '#4e7aff' },
    { name: 'C++', pct: 27, color: '#9d7cff' },
    { name: 'JavaScript', pct: 21, color: '#4de3ff' },
    { name: 'HTML/CSS', pct: 14, color: '#5a5a66' },
  ],
  activity: [
    { date: 'JUL 12', text: 'Pushed to virtual-A2DP-driver — AVDTP session work', repo: 'virtual-A2DP-driver' },
    { date: 'JUL 09', text: 'Pushed to virtual-A2DP-driver', repo: 'virtual-A2DP-driver' },
    { date: 'JUL 06', text: 'Forked rpaframework', repo: 'rpaframework' },
    { date: 'JUL 03', text: 'Pushed to FishoFisho — real-time chat', repo: 'FishoFisho-' },
    { date: 'JUL 03', text: 'Created branch in FishoFisho', repo: 'FishoFisho-' },
  ],
}

export const NAV_LINKS = [
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Works', href: '#works' },
  { label: 'Arsenal', href: '#stack' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]
