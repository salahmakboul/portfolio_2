import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/anim'

/** Animated film grain overlay — an SVG turbulence field stepped like film. */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-[0.05]">
      <svg className="h-full w-full animate-[grain_0.9s_steps(4)_infinite]">
        <filter id="grain-f">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-f)" />
      </svg>
      <style>{`@keyframes grain{0%{transform:translate(0,0)}25%{transform:translate(-2%,3%)}50%{transform:translate(3%,-2%)}75%{transform:translate(-3%,-3%)}100%{transform:translate(2%,2%)}}`}</style>
    </div>
  )
}

/** Hairline scroll progress at the very top. */
export function Progress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    const tween = gsap.to(el, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px]">
      <div ref={ref} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-electric via-amethyst to-glacier" />
    </div>
  )
}

/** Infinite marquee strip. */
export function Marquee({
  items,
  reverse = false,
  duration = 32,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  duration?: number
  className?: string
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 md:px-10">{it}</span>
          <span className="text-electric/70">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {row}
        {row}
      </div>
    </div>
  )
}
