import { useEffect, useRef } from 'react'
import SectionHead from '@/components/SectionHead'
import { JOURNEY } from '@/lib/data'
import { gsap } from '@/lib/anim'

export default function Journey() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // the spine draws itself as you scroll
      gsap.fromTo(
        '[data-spine]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-timeline]',
            start: 'top 72%',
            end: 'bottom 55%',
            scrub: 0.5,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((entry) => {
        const dot = entry.querySelector('[data-dot]')
        const card = entry.querySelector('[data-card]')
        const fromLeft = entry.dataset.side === 'left'
        const tl = gsap.timeline({
          scrollTrigger: { trigger: entry, start: 'top 78%', once: true },
        })
        tl.fromTo(
          dot,
          { scale: 0 },
          { scale: 1, duration: 0.6, ease: 'back.out(2.4)' }
        ).fromTo(
          card,
          { autoAlpha: 0, x: fromLeft ? -46 : 46, y: 12 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.95, ease: 'power3.out' },
          0.12
        )
        gsap.to(dot, {
          boxShadow: '0 0 0 6px rgba(78,122,255,0.18), 0 0 22px rgba(78,122,255,0.55)',
          scrollTrigger: { trigger: entry, start: 'top 62%', end: 'bottom 38%', toggleActions: 'play reverse play reverse' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="journey" className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
      <SectionHead kicker="04 / Journey" title="Eleven months," accent="vertical" align="center" />
      <p className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-mist">
        Every entry below is a real repository on GitHub. The dates are the commits.
      </p>

      <div data-timeline className="relative mt-20 md:mt-28">
        {/* spine */}
        <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2">
          <div data-spine className="h-full w-full origin-top bg-gradient-to-b from-electric via-amethyst to-glacier" />
        </div>

        <div className="space-y-14 md:space-y-24">
          {JOURNEY.map((j, i) => {
            const left = i % 2 === 0
            return (
              <div
                key={j.date}
                data-entry
                data-side={left ? 'left' : 'right'}
                className={`relative flex md:items-center ${left ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <span
                  data-dot
                  className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-electric md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                />
                <div className={`w-full pl-12 md:w-1/2 md:pl-0 ${left ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div data-card className="glass group inline-block w-full rounded-2xl p-7 text-left transition-transform duration-500 hover:-translate-y-1.5 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] tracking-[0.26em] text-electric">{j.date}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">{j.tag}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl tracking-tight">{j.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{j.body}</p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
