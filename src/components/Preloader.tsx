import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/anim'

const WORDS = ['SYSTEMS', 'PROTOCOLS', 'INTERFACES', 'EXPERIENCES']

/**
 * Boot sequence: counter 0→100, discipline words cycling, then a
 * double-curtain wipe that reveals the hero. Fires `portfolio:ready`.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = root.current!
    const counter = el.querySelector<HTMLElement>('[data-count]')!
    const word = el.querySelector<HTMLElement>('[data-word]')!
    const bar = el.querySelector<HTMLElement>('[data-bar]')!
    const obj = { v: 0 }
    let wi = 0

    const wordTimer = window.setInterval(() => {
      wi = (wi + 1) % WORDS.length
      gsap.fromTo(word, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
      word.textContent = WORDS[wi]
    }, 420)

    const tl = gsap.timeline({
      onComplete: () => {
        window.clearInterval(wordTimer)
        setHidden(true)
        onDone()
      },
    })

    tl.to(obj, {
      v: 100,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        counter.textContent = String(Math.round(obj.v)).padStart(3, '0')
        gsap.set(bar, { scaleX: obj.v / 100 })
      },
    })
      .to(el.querySelector('[data-inner]'), { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to(el.querySelector('[data-panel-a]'), { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<0.1')
      .to(el.querySelector('[data-panel-b]'), { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<0.12')

    return () => {
      window.clearInterval(wordTimer)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (hidden) return null

  return (
    <div ref={root} className="fixed inset-0 z-[300]" aria-hidden>
      <div data-panel-b className="absolute inset-0 bg-electric/90" />
      <div data-panel-a className="absolute inset-0 bg-ink" />
      <div data-inner className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <span data-word className="kicker block">
            {WORDS[0]}
          </span>
        </div>
        <div className="mt-6 font-display text-[clamp(4rem,14vw,9rem)] leading-none tracking-tight">
          <span data-count>000</span>
          <span className="text-electric">%</span>
        </div>
        <div className="mt-8 h-px w-48 overflow-hidden bg-white/10 md:w-72">
          <div data-bar className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-electric via-amethyst to-glacier" />
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
          compiling portfolio · salah makboul
        </p>
      </div>
    </div>
  )
}
