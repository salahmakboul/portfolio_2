import { useEffect, useRef, useState } from 'react'
import { Command } from 'lucide-react'
import { NAV_LINKS } from '@/lib/data'
import { scrollToTarget } from '@/hooks/useLenis'
import { gsap } from '@/lib/anim'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Nav({ onPalette, ready }: { onPalette: () => void; ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < 80 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (ready) gsap.fromTo(ref.current, { y: -70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.5 })
  }, [ready])

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[130] opacity-0 transition-transform duration-500 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={() => scrollToTarget('#top')}
          data-cursor="Top"
          className="font-display text-lg tracking-tight mix-blend-difference"
        >
          SM<span className="text-electric" style={{ mixBlendMode: 'normal' }}>®</span>
        </button>

        <nav className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollToTarget(l.href)}
              className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={onPalette}
            data-cursor="⌘K"
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist transition-colors hover:border-white/30 hover:text-white"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">menu</span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[9px]">K</kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
