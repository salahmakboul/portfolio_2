import { useEffect, useRef } from 'react'
import SectionHead from '@/components/SectionHead'
import { gsap, splitWords, bindSpotCards } from '@/lib/anim'

const PRINCIPLES = [
  { n: '01', t: 'Open the socket', d: 'Abstractions leak. When they do, I don’t patch around them — I rewrite the layer underneath.' },
  { n: '02', t: 'Motion is meaning', d: 'Animation isn’t decoration. It’s how software tells you what it’s doing, where you are, what comes next.' },
  { n: '03', t: 'Ship, then sharpen', d: 'A real thing in the world beats a perfect thing in a folder. Every project here shipped.' },
]

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const p = root.current!.querySelector<HTMLElement>('[data-scrub]')!
      const words = splitWords(p)
      gsap.set(words, { opacity: 0.14 })
      gsap.to(words, {
        opacity: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: {
          trigger: root.current!.querySelector('[data-pin]'),
          start: 'top top',
          end: '+=140%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      })

      gsap.fromTo(
        '[data-principle]',
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: { trigger: '[data-principles]', start: 'top 80%', once: true },
        }
      )
    }, root)
    const unbind = bindSpotCards(root.current!)
    return () => {
      ctx.revert()
      unbind()
    }
  }, [])

  return (
    <section ref={root} id="manifesto" className="relative">
      <div data-pin className="flex min-h-[100svh] items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <SectionHead kicker="01 / Manifesto" title="The short" accent="version" />
          <p
            data-scrub
            className="mt-14 max-w-5xl font-display text-[clamp(1.6rem,4vw,3.1rem)] font-medium leading-[1.28] tracking-tight md:mt-20"
          >
            I started with a shop page. Eleven months later I was rewriting the Bluetooth audio
            stack in user-mode C++. I don’t wait for permission from frameworks — when the
            abstraction leaks, I open the socket. Interfaces should breathe. Software should
            feel inevitable.
          </p>
        </div>
      </div>

      <div data-principles className="mx-auto grid max-w-[1400px] gap-4 px-6 pb-20 md:grid-cols-3 md:px-10">
        {PRINCIPLES.map((p) => (
          <div key={p.n} data-principle className="spot-card glass group rounded-2xl p-8 transition-transform duration-500 hover:-translate-y-1.5">
            <span className="font-mono text-[10px] tracking-[0.3em] text-electric">{p.n}</span>
            <h3 className="mt-4 font-display text-xl tracking-tight">{p.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
