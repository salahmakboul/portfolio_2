import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/anim'

/**
 * Custom cursor: a precise dot + a lagging ring.
 * Elements can set data-cursor="View" (etc.) to make the ring grow a label.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    document.documentElement.classList.add('cursor-active')

    const dot = dotRef.current!
    const ring = ringRef.current!
    const label = labelRef.current!

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let seen = false
    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea, select, label')
      if (t) {
        const text = t.dataset?.cursor ?? ''
        label.textContent = text
        gsap.to(ring, {
          scale: text ? 2.6 : 1.6,
          backgroundColor: text ? 'rgba(78,122,255,0.14)' : 'rgba(255,255,255,0)',
          borderColor: text ? 'rgba(120,160,255,0.65)' : 'rgba(255,255,255,0.5)',
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 })
        gsap.to(dot, { scale: text ? 0 : 0.6, duration: 0.3 })
      } else {
        gsap.to(ring, { scale: 1, backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(255,255,255,0.35)', duration: 0.35 })
        gsap.to(label, { autoAlpha: 0, duration: 0.2 })
        gsap.to(dot, { scale: 1, duration: 0.3 })
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('cursor-active')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
        style={{ marginLeft: -3, marginTop: -3 }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[199] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 opacity-0"
        style={{ marginLeft: -18, marginTop: -18 }}
      >
        <span ref={labelRef} className="font-mono text-[9px] uppercase tracking-[0.2em] text-white opacity-0">
          View
        </span>
      </div>
    </>
  )
}
