import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import { FALLBACK_STATS, GITHUB_URL } from '@/lib/data'
import { gsap, bindSpotCards } from '@/lib/anim'

type Stats = typeof FALLBACK_STATS & { live: boolean }

export default function GitHubSection() {
  const root = useRef<HTMLElement>(null)
  const [stats, setStats] = useState<Stats>({ ...FALLBACK_STATS, live: false })

  // try live GitHub API; fall back silently to the snapshot
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [u, repos] = await Promise.all([
          fetch('https://api.github.com/users/salahmakboul').then((r) => (r.ok ? r.json() : Promise.reject())),
          fetch('https://api.github.com/users/salahmakboul/repos?per_page=100').then((r) => (r.ok ? r.json() : Promise.reject())),
        ])
        if (cancelled) return
        const own = repos.filter((r: { fork: boolean }) => !r.fork)
        const langBytes: Record<string, number> = {}
        own.forEach((r: { language: string | null }) => {
          if (r.language) langBytes[r.language] = (langBytes[r.language] ?? 0) + 1
        })
        const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1
        const palette = ['#4e7aff', '#9d7cff', '#4de3ff', '#5a5a66', '#7dffca']
        const languages = Object.entries(langBytes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, n], i) => ({ name, pct: Math.round((n / total) * 100), color: palette[i] }))
        setStats((s) => ({
          ...s,
          repos: u.public_repos,
          followers: u.followers,
          following: u.following,
          languages: languages.length ? languages : s.languages,
          live: true,
        }))
      } catch {
        /* snapshot stays */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-stat]',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-stats]', start: 'top 84%', once: true },
        }
      )
      // count-up
      gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
        const target = Number(el.dataset.countTo)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-lang-bar]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: Number(el.dataset.langBar) / 100,
            duration: 1.4,
            delay: i * 0.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
      gsap.fromTo(
        '[data-activity]',
        { x: -26, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-feed]', start: 'top 85%', once: true },
        }
      )
    }, root)
    const unbind = bindSpotCards(root.current!)
    return () => {
      ctx.revert()
      unbind()
    }
  }, [stats.repos, stats.followers])

  const cards = [
    { label: 'Public repos', value: stats.repos },
    { label: 'Followers', value: stats.followers },
    { label: 'Following', value: stats.following },
    { label: 'Shipping since', value: stats.since, static: true },
  ]

  return (
    <section ref={root} className="relative border-y border-white/10 bg-ink-panel/40 py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker="05 / Open Source" title="GitHub, in" accent="numbers" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            className="group mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-white"
          >
            @salahmakboul
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>

        <div data-stats className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} data-stat className="spot-card glass rounded-2xl p-7">
              <p className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-tight">
                {c.static ? (
                  c.value
                ) : (
                  <span data-count-to={c.value}>0</span>
                )}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.26em] text-mist">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          {/* languages */}
          <div data-stat className="glass rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tight">Languages in the wild</h3>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                {stats.live ? '● live from api.github.com' : '○ snapshot'}
              </span>
            </div>
            <div className="mt-8 space-y-5">
              {stats.languages.map((l) => (
                <div key={l.name}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-white/85">{l.name}</span>
                    <span className="font-mono text-[11px] text-mist">{l.pct}%</span>
                  </div>
                  <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-white/10">
                    <div
                      data-lang-bar={l.pct}
                      className="h-full w-full origin-left rounded-full"
                      style={{ background: `linear-gradient(90deg, ${l.color}, ${l.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
              <span className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-glacier" /> explorer of forks
              </span>
              <span className="flex items-center gap-2">
                <GitFork className="h-3.5 w-3.5 text-amethyst" /> rpaframework · mermaid · forgecode
              </span>
            </div>
          </div>

          {/* activity feed */}
          <div data-stat data-feed className="glass rounded-2xl p-8">
            <h3 className="font-display text-xl tracking-tight">Recent signals</h3>
            <ul className="mt-7 space-y-5">
              {stats.activity.map((a, i) => (
                <li key={i} data-activity className="group flex items-start gap-4">
                  <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-electric">{a.date}</span>
                  <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-mist transition-colors group-hover:text-white/85">
                    {a.text}
                    <span className="block truncate font-mono text-[10px] text-dim">/{a.repo}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
