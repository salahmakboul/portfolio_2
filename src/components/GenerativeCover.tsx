import { useEffect, useRef } from 'react'
import type { Project } from '@/lib/data'

/** mulberry32 — deterministic art per project */
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

export default function GenerativeCover({
  kind,
  accent,
  seed,
  className = '',
}: {
  kind: Project['cover']
  accent: string
  seed: number
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const dpr = Math.min(window.devicePixelRatio, 2)
    const W = 880, H = 620
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    const rand = rng(seed * 7919 + 13)
    const [ar, ag, ab] = hexToRgb(accent)
    const A = (o: number) => `rgba(${ar},${ag},${ab},${o})`

    // base: deep gradient wash
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#050507')
    bg.addColorStop(0.55, '#0a0a12')
    bg.addColorStop(1, '#050508')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
    const halo = ctx.createRadialGradient(W * (0.25 + rand() * 0.5), H * (0.25 + rand() * 0.4), 40, W / 2, H / 2, W * 0.75)
    halo.addColorStop(0, A(0.22))
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, W, H)

    ctx.lineWidth = 1.2

    if (kind === 'waves') {
      // audio waveform field
      for (let row = 0; row < 26; row++) {
        const yBase = 90 + row * 18
        const amp = 6 + rand() * 34
        const freq = 0.004 + rand() * 0.012
        const phase = rand() * Math.PI * 2
        ctx.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const env = Math.sin((x / W) * Math.PI)
          const y = yBase + Math.sin(x * freq + phase) * amp * env
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = A(0.05 + rand() * 0.3)
        ctx.stroke()
      }
    } else if (kind === 'mesh') {
      // constellation network
      const pts = Array.from({ length: 42 }, () => ({ x: rand() * W, y: rand() * H }))
      pts.forEach((p, i) => {
        pts.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 170) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = A((1 - d / 170) * 0.35)
            ctx.stroke()
          }
        })
      })
      pts.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4 + rand() * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = A(0.5 + rand() * 0.5)
        ctx.fill()
      })
    } else if (kind === 'cross') {
      // medical plus-grid
      for (let gx = 60; gx < W; gx += 56) {
        for (let gy = 50; gy < H; gy += 56) {
          const s = 3 + rand() * 9
          const o = 0.06 + rand() * 0.4
          const jx = (rand() - 0.5) * 14
          const jy = (rand() - 0.5) * 14
          ctx.strokeStyle = A(o)
          ctx.beginPath()
          ctx.moveTo(gx + jx - s, gy + jy)
          ctx.lineTo(gx + jx + s, gy + jy)
          ctx.moveTo(gx + jx, gy + jy - s)
          ctx.lineTo(gx + jx, gy + jy + s)
          ctx.stroke()
        }
      }
    } else if (kind === 'radar') {
      const cx = W / 2, cy = H / 2
      for (let r = 40; r < 420; r += 52) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = A(0.14)
        ctx.stroke()
      }
      for (let a = 0; a < 12; a++) {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos((a / 12) * Math.PI * 2) * 420, cy + Math.sin((a / 12) * Math.PI * 2) * 420)
        ctx.strokeStyle = A(0.07)
        ctx.stroke()
      }
      const sweep = ctx.createConicGradient ? ctx.createConicGradient(-0.6, cx, cy) : null
      if (sweep) {
        sweep.addColorStop(0, A(0.35))
        sweep.addColorStop(0.12, 'rgba(0,0,0,0)')
        sweep.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = sweep
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, 420, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let i = 0; i < 9; i++) {
        const ang = rand() * Math.PI * 2
        const rr = 60 + rand() * 330
        ctx.beginPath()
        ctx.arc(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = A(0.85)
        ctx.fill()
      }
    } else if (kind === 'crates') {
      // stacked inventory boxes
      for (let i = 0; i < 16; i++) {
        const bw = 60 + rand() * 130
        const bh = 40 + rand() * 90
        const bx = rand() * (W - bw)
        const by = H - bh - rand() * (H * 0.55)
        ctx.fillStyle = A(0.05 + rand() * 0.1)
        ctx.strokeStyle = A(0.25 + rand() * 0.4)
        ctx.beginPath()
        ctx.roundRect(bx, by, bw, bh, 6)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = A(0.18)
        ctx.beginPath()
        ctx.moveTo(bx + 12, by + 14)
        ctx.lineTo(bx + bw - 12, by + 14)
        ctx.stroke()
      }
    } else {
      // orbit — the origin storefront
      const cx = W / 2, cy = H / 2
      for (let i = 0; i < 5; i++) {
        const r = 60 + i * 62
        ctx.beginPath()
        ctx.ellipse(cx, cy, r * 1.35, r * 0.62, -0.35, 0, Math.PI * 2)
        ctx.strokeStyle = A(0.16 + i * 0.03)
        ctx.stroke()
        const t = rand() * Math.PI * 2
        ctx.beginPath()
        ctx.arc(cx + Math.cos(t) * r * 1.35, cy + Math.sin(t) * r * 0.62 - r * 0.13, 3, 0, Math.PI * 2)
        ctx.fillStyle = A(0.9)
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(cx, cy, 16, 0, Math.PI * 2)
      ctx.fillStyle = A(0.9)
      ctx.fill()
    }

    // vignette + scanlines
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.72)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = 'rgba(255,255,255,0.022)'
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1)
  }, [kind, accent, seed])

  return <canvas ref={ref} className={className} aria-hidden />
}
