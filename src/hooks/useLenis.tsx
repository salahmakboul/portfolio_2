import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

const LenisCtx = createContext<Lenis | null>(null)

export function useLenisInstance() {
  return useContext(LenisCtx)
}

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    window.__lenis = instance
    setLenis(instance)
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      window.__lenis = undefined
      setLenis(null)
    }
  }, [])

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}

export function scrollToTarget(target: string) {
  const el = document.querySelector(target)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
