import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownRight, Boxes, Github, Sparkles } from 'lucide-react'
import HeroCanvas2D from '@/components/HeroCanvas2D'
import Magnetic from '@/components/Magnetic'
import { gsap, splitChars, prefersReducedMotion } from '@/lib/anim'
import { GITHUB_URL } from '@/lib/data'
import { scrollToTarget } from '@/hooks/useLenis'

const HeroCanvas3D = lazy(() => import('@/components/HeroCanvas'))

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<'2d' | '3d'>('2d')

  // pin the italic accent to the end of "MAKBOUL"
  useEffect(() => {
    const role = root.current!.querySelector<HTMLElement>('[data-hero-role]')!
    const line2 = root.current!.querySelector<HTMLElement>('[data-line-2]')!
    const h1 = root.current!.querySelector('h1')!
    const place = () => {
      const w = line2.getBoundingClientRect().width
      const hw = h1.getBoundingClientRect().width
      const rw = role.getBoundingClientRect().width
      role.style.left = `${Math.max(0, Math.min(w - rw * 0.45, hw - rw))}px`
    }
    document.fonts?.ready.then(place)
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])

  // entrance choreography
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const chars1 = splitChars(root.current!.querySelector<HTMLElement>('[data-line-1]')!)
      const chars2 = splitChars(root.current!.querySelector<HTMLElement>('[data-line-2]')!)
      const all = [...chars1, ...chars2]

      if (prefersReducedMotion()) {
        gsap.set(all, { yPercent: 0, rotate: 0 })
        gsap.set('[data-hero-fade]', { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(all, { yPercent: 118, rotate: 6 })
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to(chars1, { yPercent: 0, rotate: 0, duration: 1.35, stagger: 0.045 }, 0.1)
        .to(chars2, { yPercent: 0, rotate: 0, duration: 1.35, stagger: 0.045 }, 0.32)
        .fromTo(
          '[data-hero-role]',
          { autoAlpha: 0, y: 34, rotate: -4 },
          { autoAlpha: 1, y: 0, rotate: -2, duration: 1.2, ease: 'power3.out' },
          0.9
        )
        .fromTo('[data-hero-fade]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 1.0)
        .fromTo('[data-hero-hud]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, stagger: 0.12 }, 1.3)
    }, root)
    return () => ctx.revert()
  }, [ready])

  // scroll-out parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-content]', {
        yPercent: -14,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-hud]', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '40% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="top"
      className={`relative flex min-h-[100svh] flex-col overflow-hidden ${mode === '3d' ? 'theme-locked-dark' : ''}`}
    >
      {mode === '3d' ? (
        <Suspense fallback={<HeroCanvas2D />}>
          <HeroCanvas3D />
        </Suspense>
      ) : (
        <HeroCanvas2D />
      )}

      <button
        onClick={() => setMode((m) => (m === '2d' ? '3d' : '2d'))}
        data-cursor={mode === '2d' ? '3D' : '2D'}
        className="glass absolute right-6 top-36 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist transition-colors hover:border-white/30 hover:text-white md:right-10"
      >
        {mode === '2d' ? <Boxes className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        {mode === '2d' ? '3D mode' : '2D mode'}
      </button>

      {/* HUD corners */}
      <div data-hero-hud className="pointer-events-none absolute left-6 top-24 z-10 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-mist md:left-10 md:block">
        <p>16 public repos</p>
        <p className="mt-1 text-dim">est. 2025 — present</p>
      </div>
      <div data-hero-hud className="pointer-events-none absolute right-6 top-24 z-10 hidden text-right font-mono text-[10px] uppercase tracking-[0.28em] text-mist md:right-10 md:block">
        <p>c++ · python · ts</p>
        <p className="mt-1 text-dim">sockets → pixels</p>
      </div>
      <div data-hero-hud className="pointer-events-none absolute bottom-8 right-6 z-10 hidden text-right font-mono text-[10px] uppercase tracking-[0.28em] text-mist md:right-10 md:block">
        <p>github.com/salahmakboul</p>
        <p className="mt-1 text-dim">working worldwide</p>
      </div>

      {/* core */}
      <div data-hero-content className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-28 pt-32 md:px-10">
        <div data-hero-fade className="mb-8 flex items-center gap-3 opacity-0">
          <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 ping-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-mist">
            Available for ambitious work
          </span>
        </div>

        <h1 className="relative font-display leading-[0.86] tracking-tight">
          <span className="block overflow-hidden pb-1">
            <span data-line-1 className="block text-[clamp(3.4rem,12.5vw,11.5rem)]">
              SALAH
            </span>
          </span>
          <span className="block overflow-hidden pb-3">
            <span data-line-2 className="block text-[clamp(3.4rem,12.5vw,11.5rem)]">
              MAKBOUL
            </span>
          </span>
          <span
            data-hero-role
            className="font-serif-it pointer-events-none absolute bottom-[0.1em] left-[min(58vw,11.2ch)] block text-[clamp(1.5rem,4vw,3.2rem)] font-normal text-gradient opacity-0"
          >
            creative engineer
          </span>
        </h1>

        <p data-hero-fade className="mt-12 max-w-md text-[15px] leading-relaxed text-mist opacity-0 md:text-base">
          From raw Bluetooth sockets in C++ to real-time AI chat in Django —
          I build the whole stack, top to bottom, and I make it feel{' '}
          <span className="font-serif-it text-white">alive</span>.
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-5 opacity-0">
          <Magnetic>
            <button
              onClick={() => scrollToTarget('#works')}
              data-cursor="Go"
              className="group relative overflow-hidden rounded-full bg-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-black transition-transform duration-500"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-electric via-amethyst to-glacier transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                View selected works
                <ArrowDownRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              className="glass flex items-center gap-2 rounded-full px-8 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition-colors duration-500 hover:border-white/30"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Magnetic>
        </div>
      </div>

      {/* scroll cue */}
      <div data-hero-hud className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-dim">scroll</span>
        <div className="h-12 w-px overflow-hidden bg-white/10">
          <div className="scroll-cue-line h-full w-full bg-gradient-to-b from-electric to-glacier" />
        </div>
      </div>
    </section>
  )
}
