import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '@/lib/anim'

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), u.x),
             mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i = 0; i < 5; i++){
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.055;

  // double domain warp — the aurora
  vec2 q = vec2(fbm(p * 1.35 + t), fbm(p * 1.35 - t * 0.7));
  vec2 r = vec2(fbm(p * 1.8 + q * 1.7 + vec2(1.7, 9.2) + t * 0.55),
                fbm(p * 1.8 + q * 1.7 + vec2(8.3, 2.8) - t * 0.42));
  float f = fbm(p * 1.55 + r * 1.9);

  // band keeps light off the lower half where the type sits
  float band = smoothstep(1.05, 0.05, abs(p.y + 0.32 + 0.12 * sin(p.x * 1.8 + t * 3.0)));

  vec3 blue   = vec3(0.306, 0.478, 1.000);
  vec3 violet = vec3(0.616, 0.486, 1.000);
  vec3 cyan   = vec3(0.302, 0.890, 1.000);

  vec3 col = mix(blue, violet, clamp(q.x * 1.3, 0.0, 1.0));
  col = mix(col, cyan, clamp(r.y, 0.0, 1.0) * 0.55);
  col *= pow(f, 2.6) * 2.4 * band;

  // pointer light — a soft electric halo that follows curiosity
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  m.y = -m.y;
  float d = length(p - m);
  col += mix(blue, cyan, 0.5) * 0.16 * exp(-d * 3.2) * (0.35 + 0.65 * f);

  // horizon glow line
  col += blue * 0.05 * exp(-abs(p.y + 0.34) * 9.0);

  // vignette, scroll fade, dither
  col *= smoothstep(1.5, 0.3, length(p * vec2(0.85, 1.0)));
  col *= 1.0 - uScroll * 0.9;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`

const VERT = /* glsl */ `
void main(){ gl_Position = vec4(position, 1.0); }
`

export default function HeroCanvas() {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const holder = mount.current!
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 1)
    const dpr = Math.min(window.devicePixelRatio, 1.5)
    renderer.setPixelRatio(dpr)
    holder.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uScroll: { value: 0 },
    }
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ fragmentShader: FRAG, vertexShader: VERT, uniforms })
    )
    scene.add(quad)

    // starfield — separate perspective scene layered above
    const starScene = new THREE.Scene()
    const starCam = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    starCam.position.z = 8
    const N = 650
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xaec4ff,
        size: 0.035,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    starScene.add(stars)

    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999 }
    const onMove = (e: PointerEvent) => {
      const r = holder.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) * dpr
      mouse.y = (e.clientY - r.top) * dpr
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const resize = () => {
      const w = holder.clientWidth, h = holder.clientHeight
      renderer.setSize(w, h, false)
      uniforms.uRes.value.set(w * dpr, h * dpr)
      starCam.aspect = w / h
      starCam.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let visible = true
    let scrolled = 0
    const clock = new THREE.Clock()

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(holder)
    const onVis = () => (visible = !document.hidden)
    document.addEventListener('visibilitychange', onVis)
    const onScroll = () => {
      scrolled = Math.min(1, window.scrollY / Math.max(1, holder.clientHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const reduced = prefersReducedMotion()
    const render = () => {
      raf = requestAnimationFrame(render)
      if (!visible) return
      const t = clock.getElapsedTime()
      uniforms.uTime.value = t
      mouse.sx += (mouse.x - mouse.sx) * 0.06
      mouse.sy += (mouse.y - mouse.sy) * 0.06
      uniforms.uMouse.value.set(mouse.sx, mouse.sy)
      uniforms.uScroll.value += (scrolled - uniforms.uScroll.value) * 0.08

      stars.rotation.y = t * 0.012
      stars.rotation.x = Math.sin(t * 0.05) * 0.05
      starCam.position.x += (((mouse.sx / (holder.clientWidth * dpr || 1)) - 0.5) * 0.6 - starCam.position.x) * 0.03
      starCam.position.y += (-((mouse.sy / (holder.clientHeight * dpr || 1)) - 0.5) * 0.4 - starCam.position.y) * 0.03

      renderer.autoClear = true
      renderer.render(scene, camera)
      renderer.autoClear = false
      renderer.render(starScene, starCam)

      if (reduced) cancelAnimationFrame(raf) // single static frame
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      quad.geometry.dispose()
      ;(quad.material as THREE.Material).dispose()
      starGeo.dispose()
      ;(stars.material as THREE.Material).dispose()
      renderer.dispose()
      holder.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mount} aria-hidden className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />
}
