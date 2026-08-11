import { lazy, Suspense, useEffect, useState } from 'react'
import { ScrollTrigger } from '@/lib/anim'
import { LenisProvider } from '@/hooks/useLenis'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import CommandPalette from '@/components/CommandPalette'

const SalahAI = lazy(() => import('@/components/SalahAI'))
import { Grain, Progress } from '@/components/Atmosphere'
import { Marquee } from '@/components/Atmosphere'
import Hero from '@/sections/Hero'
import Manifesto from '@/sections/Manifesto'
import Works from '@/sections/Works'
import Arsenal from '@/sections/Arsenal'
import Journey from '@/sections/Journey'
import GitHubSection from '@/sections/GitHubSection'
import Services from '@/sections/Services'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'

export default function Home() {
  const [ready, setReady] = useState(false)
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    if (ready) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [ready])

  return (
    <LenisProvider>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Grain />
      <Progress />
      <Nav ready={ready} onPalette={() => setPalette(true)} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} onToggle={() => setPalette((v) => !v)} />
      {ready && (
        <Suspense fallback={null}>
          <SalahAI />
        </Suspense>
      )}

      <main className="relative">
        <Hero ready={ready} />

        <div className="border-y border-white/10 bg-ink-panel/60 py-5 backdrop-blur-sm">
          <Marquee
            items={[
              'AVAILABLE FOR WORK',
              'C++17',
              'PYTHON',
              'TYPESCRIPT',
              'DJANGO',
              'REACT',
              'WEBGL',
              'REAL-TIME SYSTEMS',
            ]}
            duration={36}
            className="font-mono text-[11px] uppercase tracking-[0.34em] text-mist"
          />
        </div>

        <Manifesto />
        <Works />
        <Arsenal />
        <Journey />
        <GitHubSection />
        <Services />
        <Contact />
        <Footer />
      </main>
    </LenisProvider>
  )
}
