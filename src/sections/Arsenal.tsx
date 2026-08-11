import { useEffect, useRef, useState } from 'react'
import SectionHead from '@/components/SectionHead'
import { Marquee } from '@/components/Atmosphere'
import { STACK, type StackItem } from '@/lib/data'
import { gsap, bindSpotCards } from '@/lib/anim'

const FILTERS = ['All', 'Languages', 'Frameworks', 'Systems', 'Tools'] as const

export default function Arsenal() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const items = filter === 'All' ? STACK : STACK.filter((s) => s.group === filter)

  // entrance + bar animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
      gsap.fromTo(
        cards,
        { y: 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.045,
          scrollTrigger: { trigger: grid.current, start: 'top 85%', once: true },
        }
      )
      cards.forEach((card) => {
        const bar = card.querySelector('[data-bar]')
        const lvl = card.querySelector('[data-level]')
        if (bar && lvl) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: Number(lvl.textContent) / 100,
              duration: 1.4,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            }
          )
        }
      })
    }, grid)
    return () => ctx.revert()
  }, [filter])

  useEffect(() => bindSpotCards(root.current!), [filter])

  // tilt on hover
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const cards = grid.current!.querySelectorAll<HTMLElement>('[data-card]')
    const cleanups: Array<() => void> = []
    cards.forEach((card) => {
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 9
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 700, duration: 0.4, ease: 'power2.out' })
      }
      const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' })
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [filter])

  return (
    <section ref={root} id="stack" className="relative overflow-hidden py-24 md:py-36">
      {/* ghost marquee behind everything */}
      <div className="pointer-events-none absolute inset-x-0 top-24 opacity-[0.05]">
        <Marquee
          items={['C++', 'PYTHON', 'TYPESCRIPT', 'DJANGO', 'REACT', 'WASAPI', 'L2CAP', 'WEBSOCKETS']}
          duration={48}
          className="font-display text-[11rem] leading-none tracking-tight"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead kicker="03 / Arsenal" title="Tools of" accent="the trade" />
          <div className="flex flex-wrap gap-2 pb-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor="Filter"
                className={`rounded-full border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  filter === f
                    ? 'border-electric bg-electric/15 text-white shadow-[0_0_24px_rgba(78,122,255,0.35)]'
                    : 'border-white/10 text-mist hover:border-white/30 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div ref={grid} className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s: StackItem) => (
            <div
              key={s.name}
              data-card
              className="spot-card glass group rounded-2xl p-6 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg tracking-tight">{s.name}</h3>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-dim">{s.group}</span>
              </div>
              <p className="mt-3 min-h-[2.5rem] text-[13px] leading-relaxed text-mist">{s.note}</p>
              <div className="mt-5">
                <div className="flex items-center justify-between font-mono text-[10px] text-dim">
                  <span>fluency</span>
                  <span data-level className="text-white/80">{s.level}</span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                  <div
                    data-bar
                    className="h-full w-full origin-left rounded-full bg-gradient-to-r from-electric via-amethyst to-glacier"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
