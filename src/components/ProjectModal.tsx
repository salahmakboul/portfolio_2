import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github, X } from 'lucide-react'
import type { Project } from '@/lib/data'
import GenerativeCover from './GenerativeCover'

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    window.__lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.article
            data-lenis-prevent
            className="relative z-10 flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-panel md:rounded-3xl"
            initial={{ y: 90, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              data-cursor="Close"
              className="glass absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-300 hover:rotate-90"
              aria-label="Close project"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative h-52 shrink-0 overflow-hidden md:h-72">
              <GenerativeCover
                kind={project.cover}
                accent={project.accent}
                seed={project.index.charCodeAt(1)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-panel via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 md:left-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
                  {project.index} — {project.year} · {project.role}
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-tight md:text-5xl">{project.title}</h3>
              </div>
            </div>

            <div className="grid flex-1 gap-10 overflow-y-auto p-6 md:grid-cols-[1.5fr_1fr] md:p-10">
              <div className="space-y-10">
                <div>
                  <p className="font-serif-it text-lg text-white/90">{project.tagline}</p>
                  <p className="mt-4 leading-relaxed text-mist">{project.overview}</p>
                </div>

                <div>
                  <h4 className="kicker mb-4 text-electric">Architecture</h4>
                  <p className="text-sm leading-relaxed text-white/85">{project.architecture.body}</p>
                  {project.architecture.diagram && (
                    <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-5 font-mono text-[10.5px] leading-relaxed text-glacier/90 md:text-xs">
                      {project.architecture.diagram}
                    </pre>
                  )}
                </div>

                <div>
                  <h4 className="kicker mb-4 text-electric">Features</h4>
                  <ul className="space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-mist">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-electric" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="kicker mb-4 text-amethyst">Challenges</h4>
                  <ul className="space-y-3">
                    {project.challenges.map((c) => (
                      <li key={c} className="glass rounded-xl p-4 text-[13px] leading-relaxed text-white/85">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="kicker mb-4 text-glacier">What I learned</h4>
                  <ul className="space-y-2.5">
                    {project.learned.map((l) => (
                      <li key={l} className="flex gap-3 text-[13px] text-mist">
                        <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-glacier" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="kicker mb-4">Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span key={s} className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Open"
                    className="group flex items-center justify-between rounded-full bg-white px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-electric hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> View repository
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                    status — {project.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
