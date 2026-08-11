import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import GenerativeCover from '@/components/GenerativeCover'
import ProjectModal from '@/components/ProjectModal'
import { PROJECTS, type Project } from '@/lib/data'
import { gsap } from '@/lib/anim'

export default function Works() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<Project | null>(null)
  const [active, setActive] = useState<Project | null>(null)
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  // floating preview follows the pointer with weight + tilt by velocity
  useEffect(() => {
    if (!fine) return
    const el = preview.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    let lastX = 0
    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const vel = gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.4)
      lastX = e.clientX
      gsap.to(el, { rotate: vel, duration: 0.6, ease: 'power2.out' })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [fine])

  useEffect(() => {
    if (!fine) return
    gsap.to(preview.current, {
      autoAlpha: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.86,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [hovered, fine])

  // rows entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-row]',
        { y: 70, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: '[data-rows]', start: 'top 82%', once: true },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="works" className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead kicker="02 / Selected Works" title="Things I" accent="built" />
        <p className="max-w-xs pb-3 text-sm leading-relaxed text-mist">
          Six builds, eleven months, one trajectory: from first HTML page to a
          hand-written Bluetooth stack. Click any row for the full teardown.
        </p>
      </div>

      <div data-rows className="mt-16 md:mt-24">
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            data-row
            data-cursor="View"
            onClick={() => setActive(p)}
            onPointerEnter={() => setHovered(p)}
            onPointerLeave={() => setHovered(null)}
            className="group relative block w-full border-t border-white/10 py-7 text-left transition-colors duration-500 last:border-b hover:border-white/25 md:py-9"
          >
            <div className="flex items-center gap-5 md:gap-10">
              <span className="w-8 shrink-0 font-mono text-[11px] tracking-[0.2em] text-dim transition-colors duration-500 group-hover:text-electric">
                {p.index}
              </span>

              {/* mobile thumb */}
              <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 md:hidden">
                <GenerativeCover kind={p.cover} accent={p.accent} seed={i + 1} className="h-full w-full" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[clamp(1.5rem,4.2vw,3.4rem)] leading-none tracking-tight text-white/85 transition-all duration-500 group-hover:translate-x-3 group-hover:text-white">
                  {p.title}
                </span>
                <span className="mt-2 block truncate text-[13px] text-mist transition-all duration-500 group-hover:translate-x-3">
                  {p.tagline}
                </span>
              </span>

              <span className="hidden shrink-0 flex-col items-end gap-2 md:flex">
                <span className="font-mono text-[11px] tracking-[0.2em] text-dim">{p.year}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                  {p.stack.slice(0, 3).join(' · ')}
                </span>
              </span>

              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-electric group-hover:bg-electric md:flex">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </div>

            {/* accent line that draws under the hovered row */}
            <span
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
              style={{ background: `linear-gradient(90deg, ${p.accent}, transparent 70%)` }}
            />
          </button>
        ))}
      </div>

      {/* floating preview (desktop) */}
      {fine && (
        <div
          ref={preview}
          className="pointer-events-none fixed left-0 top-0 z-[80] h-[240px] w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/15 opacity-0 shadow-2xl shadow-black/60"
          style={{ marginLeft: 190, marginTop: -140 }}
        >
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`absolute inset-0 transition-opacity duration-300 ${hovered?.id === p.id ? 'opacity-100' : 'opacity-0'}`}
            >
              <GenerativeCover kind={p.cover} accent={p.accent} seed={i + 1} className="h-full w-full" />
            </div>
          ))}
        </div>
      )}

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
