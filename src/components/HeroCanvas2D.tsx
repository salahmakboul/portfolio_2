import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/anim'

function hexToRgb(hex: string): string {
  const h = hex.trim().replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(n, 16)
  return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`
}

function readThemeColors() {
  const s = getComputedStyle(document.documentElement)
  const bg = s.getPropertyValue('--bg').trim() || '#000000'
  return {
    bg,
    blue: hexToRgb(s.getPropertyValue('--blue').trim() || '#4e7aff'),
    violet: hexToRgb(s.getPropertyValue('--violet').trim() || '#9d7cff'),
    cyan: hexToRgb(s.getPropertyValue('--cyan').trim() || '#4de3ff'),
  }
}

export default function HeroCanvas2D() {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const holder = mount.current!
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.className = 'h-full w-full'
    holder.appendChild(canvas)

    let colors = readThemeColors()
    const blobs = () => [
      { color: colors.blue, r: 0.55, sx: 0.33, sy: 0.28, ax: 0.16, ay: 0.1, speed: 0.55 },
      { color: colors.violet, r: 0.48, sx: 0.62, sy: 0.62, ax: 0.14, ay: 0.13, speed: 0.42 },
      { color: colors.cyan, r: 0.4, sx: 0.5, sy: 0.85, ax: 0.2, ay: 0.06, speed: 0.68 },
    ]
    const themeObserver = new MutationObserver(() => {
      colors = readThemeColors()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const resize = () => {
      w = holder.clientWidth
      h = holder.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e: PointerEvent) => {
      const r = holder.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(holder)
    const onVis = () => (visible = !document.hidden)
    document.addEventListener('visibilitychange', onVis)

    let scrolled = 0
    const onScroll = () => {
      scrolled = Math.min(1, window.scrollY / Math.max(1, holder.clientHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const reduced = prefersReducedMotion()
    let raf = 0
    const start = performance.now()

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      const t = (now - start) / 1000

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, w, h)

      const diag = Math.hypot(w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const b of blobs()) {
        const cx = (b.sx + Math.sin(t * b.speed) * b.ax) * w
        const cy = (b.sy + Math.cos(t * b.speed * 0.8) * b.ay) * h
        const radius = b.r * diag * (1 - scrolled * 0.3)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        g.addColorStop(0, `rgba(${b.color},${0.5 * (1 - scrolled)})`)
        g.addColorStop(1, `rgba(${b.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // pointer glow
      if (mouse.x > -9000) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, diag * 0.18)
        g.addColorStop(0, `rgba(${colors.blue},${0.12 * (1 - scrolled)})`)
        g.addColorStop(1, `rgba(${colors.blue},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, diag * 0.18, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      if (reduced) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      holder.removeChild(canvas)
    }
  }, [])

  return <div ref={mount} aria-hidden className="absolute inset-0" />
}
