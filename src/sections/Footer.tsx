import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Marquee } from '@/components/Atmosphere'
import Magnetic from '@/components/Magnetic'
import { GITHUB_URL, NAV_LINKS } from '@/lib/data'
import { scrollToTarget } from '@/hooks/useLenis'

export default function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="relative border-t border-white/10">
      <Marquee
        items={["LET'S BUILD SOMETHING UNREASONABLE", 'SYSTEMS', 'INTERFACES', 'IMPOSSIBLE THINGS']}
        duration={40}
        className="border-b border-white/10 py-8 font-display text-[clamp(2rem,6vw,4.5rem)] leading-none tracking-tight text-white/10"
      />

      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl tracking-tight">
            Salah Makboul<span className="text-electric">®</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            Creative engineer. Built with React, GSAP, Lenis and a hand-written WebGL shader —
            no templates were harmed.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollToTarget(l.href)}
              data-cursor="Go"
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-white"
            >
              {l.label}
            </button>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-white"
          >
            GitHub ↗
          </a>
        </nav>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">local time</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-white/85">{time}</p>
          </div>
          <Magnetic>
            <button
              onClick={() => scrollToTarget('#top')}
              data-cursor="Top"
              aria-label="Back to top"
              className="glass flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:border-electric"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1400px] px-6 py-5 font-mono text-[10px] uppercase tracking-[0.24em] text-dim md:px-10">
          © 2026 — designed & engineered by salah makboul · from socket to pixel
        </p>
      </div>
    </footer>
  )
}
