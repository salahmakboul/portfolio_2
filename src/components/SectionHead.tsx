import { useEffect, useRef } from 'react'
import { gsap, splitChars } from '@/lib/anim'

/**
 * Signature section header:
 *  [mono kicker + drawing rule]  then a big display title whose chars
 *  slide up out of an overflow mask, with an italic serif accent word.
 */
export default function SectionHead({
  kicker,
  title,
  accent,
  after,
  align = 'left',
}: {
  kicker: string
  title: string
  accent?: string
  after?: string
  align?: 'left' | 'center'
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = splitChars(root.current!.querySelector<HTMLElement>('[data-title]')!)
      gsap.set(chars, { yPercent: 110 })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
      })
      tl.fromTo(
        root.current!.querySelector('[data-rule]'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power3.inOut' },
        0
      )
        .fromTo(
          root.current!.querySelector('[data-kicker]'),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.15
        )
        .to(chars, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.022 }, 0.2)
      if (accent) {
        tl.fromTo(
          root.current!.querySelector('[data-accent]'),
          { autoAlpha: 0, y: 26, rotate: 3 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 1.0, ease: 'power3.out' },
          0.55
        )
      }
    }, root)
    return () => ctx.revert()
  }, [accent])

  return (
    <div ref={root} className={align === 'center' ? 'text-center' : ''}>
      <div className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <span data-kicker className="kicker">
          {kicker}
        </span>
        <span data-rule className="hairline w-16 origin-left md:w-28" />
      </div>
      <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
        <span className="block overflow-hidden pb-1">
          <span data-title className="inline-block">
            {title}
          </span>
        </span>
        {(accent || after) && (
          <span className="block overflow-hidden pb-2">
            {accent && (
              <span data-accent className="font-serif-it mr-3 inline-block font-normal text-gradient">
                {accent}
              </span>
            )}
            {after && <span className="outline-text font-display">{after}</span>}
          </span>
        )}
      </h2>
    </div>
  )
}
