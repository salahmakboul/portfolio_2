import { useEffect } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Copy, Github, Search } from 'lucide-react'
import { NAV_LINKS, PROJECTS, EMAIL, GITHUB_URL } from '@/lib/data'
import { scrollToTarget } from '@/hooks/useLenis'

export default function CommandPalette({
  open,
  onClose,
  onToggle,
}: {
  open: boolean
  onClose: () => void
  onToggle: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onToggle()
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onToggle])

  useEffect(() => {
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [open])

  const go = (href: string) => {
    onClose()
    setTimeout(() => scrollToTarget(href), 60)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: 18, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.985, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-panel/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
          >
            <Command label="Command menu" className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.24em] [&_[cmdk-group-heading]]:text-dim">
              <div className="flex items-center gap-3 border-b border-white/10 px-5">
                <Search className="h-4 w-4 text-mist" />
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, a project, an action…"
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-dim"
                />
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[9px] text-mist">ESC</kbd>
              </div>
              <Command.List className="max-h-[46vh] overflow-y-auto p-2" data-lenis-prevent>
                <Command.Empty className="px-4 py-8 text-center font-mono text-xs text-mist">
                  nothing found — try “works” or “github”
                </Command.Empty>

                <Command.Group heading="Navigate">
                  {NAV_LINKS.map((l) => (
                    <Item key={l.href} onSelect={() => go(l.href)}>
                      {l.label}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Projects">
                  {PROJECTS.map((p) => (
                    <Item key={p.id} onSelect={() => window.open(p.repo, '_blank')}>
                      {p.title}
                      <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                        repo ↗
                      </span>
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Actions">
                  <Item onSelect={() => window.open(GITHUB_URL, '_blank')}>
                    <Github className="h-3.5 w-3.5 text-mist" /> Open GitHub profile
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-dim" />
                  </Item>
                  <Item
                    onSelect={() => {
                      navigator.clipboard?.writeText(EMAIL)
                      onClose()
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 text-mist" /> Copy email address
                  </Item>
                </Command.Group>
              </Command.List>
              <div className="border-t border-white/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                salah makboul — command interface
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 transition-colors aria-selected:bg-white/10 aria-selected:text-white"
    >
      {children}
    </Command.Item>
  )
}
