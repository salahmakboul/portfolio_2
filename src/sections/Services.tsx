import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import { SERVICES } from '@/lib/data'
import { gsap } from '@/lib/anim'

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-service]',
        { y: 56, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-services]', start: 'top 82%', once: true },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead kicker="06 / Capabilities" title="What I can" accent="do for you" />
        <p className="max-w-xs pb-3 text-sm leading-relaxed text-mist">
          Four disciplines, one habit: going deeper than the job description.
        </p>
      </div>

      <div data-services className="mt-16 md:mt-24">
        {SERVICES.map((s, i) => {
          const isOpen = open === i
          return (
            <div key={s.index} data-service className="border-t border-white/10 last:border-b">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                data-cursor={isOpen ? 'Close' : 'More'}
                className="group flex w-full items-center gap-6 py-8 text-left md:gap-12 md:py-10"
                aria-expanded={isOpen}
              >
                <span className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-white/10 transition-colors duration-500 group-hover:text-electric/60">
                  {s.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[clamp(1.4rem,3.4vw,2.6rem)] leading-tight tracking-tight text-white/85 transition-all duration-500 group-hover:translate-x-2 group-hover:text-white">
                    {s.title}
                  </span>
                  <span className="font-serif-it mt-1 block text-[15px] text-mist md:text-lg">
                    {s.claim}
                  </span>
                </span>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    isOpen ? 'rotate-45 border-electric bg-electric/15' : 'border-white/15 group-hover:border-white/40'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-10 md:grid-cols-[auto_1fr] md:gap-12 md:pl-[calc(clamp(2rem,5vw,4rem)+3rem)]">
                      <div className="flex max-w-2xl flex-col gap-6">
                        <p className="leading-relaxed text-mist">{s.body}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-electric/25 bg-electric/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
