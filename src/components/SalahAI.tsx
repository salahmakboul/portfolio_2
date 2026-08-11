import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { answer, greeting, type AiReply, type Chip } from '@/lib/salahai'
import { prefersReducedMotion } from '@/lib/anim'
import { scrollToTarget } from '@/hooks/useLenis'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  chips?: Chip[]
  pending?: boolean
  error?: boolean
}

const STORAGE_KEY = 'salahai:messages'
const uid = () => Math.random().toString(36).slice(2, 10)

function loadStored(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-panel'

export default function SalahAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(loadStored)
  const [input, setInput] = useState('')
  const [hasUnread, setHasUnread] = useState(false)
  const reduced = prefersReducedMotion()

  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      /* storage unavailable — conversation just won't persist */
    }
  }, [messages])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 260)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, reduced])

  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      setHasUnread(false)
    } else if (wasOpen.current) {
      // return focus to the launcher only once it has actually re-mounted
      requestAnimationFrame(() => launcherRef.current?.focus())
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [messages])

  const resolveChip = (chip: Chip) => {
    if (chip.action.kind === 'prompt') {
      send(chip.action.value)
      return
    }
    if (chip.action.kind === 'scroll') {
      setOpen(false)
      window.setTimeout(() => scrollToTarget(chip.action.value), 80)
      return
    }
    window.open(chip.action.value, '_blank', 'noopener,noreferrer')
  }

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    setInput('')
    const userMsg: ChatMessage = { id: uid(), role: 'user', text }
    const pendingId = uid()
    setMessages((m) => [...m, userMsg, { id: pendingId, role: 'assistant', text: '', pending: true }])

    const delay = reduced ? 120 : 420 + Math.random() * 420
    window.setTimeout(() => {
      let reply: AiReply
      try {
        reply = answer(text)
      } catch {
        reply = { text: 'Something glitched on my end — mind trying that again?', chips: [{ label: 'Retry', action: { kind: 'prompt', value: text } }] }
      }
      setMessages((m) => m.map((msg) => (msg.id === pendingId ? { ...msg, text: reply.text, chips: reply.chips, pending: false } : msg)))
      if (!openRef.current) setHasUnread(true)
    }, delay)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const isEmpty = messages.length === 0
  const g = greeting()

  return (
    <AnimatePresence>
      {!open ? (
        <motion.button
          key="launcher"
          ref={launcherRef}
          layoutId="salahai-shell"
          onClick={() => setOpen(true)}
          data-cursor="Ask"
          aria-label="Open SalahAI, portfolio assistant"
          className={`glass fixed bottom-6 right-6 z-[140] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl shadow-black/50 ${focusRing}`}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22, delay: reduced ? 0 : 1.2 }}
        >
          <MessageCircle className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-electric text-electric ping-dot" aria-hidden />
          )}
        </motion.button>
      ) : (
        <motion.div
          key="panel"
          layoutId="salahai-shell"
          role="dialog"
          aria-modal="true"
          aria-label="SalahAI, portfolio assistant"
          className="fixed bottom-6 right-6 z-[140] flex h-[min(560px,72svh)] w-[min(392px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-panel/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="glass flex h-8 w-8 items-center justify-center rounded-full text-electric">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">SalahAI</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mist">guide to salah's work</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              data-cursor="Close"
              aria-label="Close chat"
              className={`flex h-8 w-8 items-center justify-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-white ${focusRing}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* messages */}
          <div ref={listRef} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {isEmpty ? (
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: reduced ? 0 : 0.06 }}
              >
                <Bubble role="assistant" text={g.text} />
                <ChipRow chips={g.chips} onSelect={resolveChip} />
              </motion.div>
            ) : (
              messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.12 : 0.32, ease: 'easeOut' }}
                >
                  {m.pending ? (
                    <TypingBubble />
                  ) : (
                    <>
                      <Bubble role={m.role} text={m.text} error={m.error} />
                      {m.chips && m.chips.length > 0 && <ChipRow chips={m.chips} onSelect={resolveChip} />}
                    </>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a project, the stack, GitHub…"
              className={`w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-dim focus:border-electric/60 ${focusRing}`}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              data-cursor="Send"
              aria-label="Send message"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:opacity-30 ${focusRing}`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Bubble({ role, text, error }: { role: 'user' | 'assistant'; text: string; error?: boolean }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-white text-black'
            : `rounded-bl-md text-white/90 ${error ? 'border border-red-400/40 bg-red-400/10' : 'glass'}`
        }`}
      >
        {text}
      </p>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="glass flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-mist"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}

function ChipRow({ chips, onSelect }: { chips: Chip[]; onSelect: (c: Chip) => void }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={() => onSelect(c)}
          className={`glass flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-white/30 hover:text-white ${focusRing}`}
        >
          {c.label}
          {c.action.kind === 'link' && <ArrowUpRight className="h-3 w-3" />}
        </button>
      ))}
    </div>
  )
}
