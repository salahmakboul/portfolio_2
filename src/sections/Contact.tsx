import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Github, Send } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import Magnetic from '@/components/Magnetic'
import { EMAIL, GITHUB_URL } from '@/lib/data'
import { gsap } from '@/lib/anim'

type Field = 'name' | 'email' | 'message'

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-contact-reveal]',
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 74%', once: true },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const validate = () => {
    const e: Partial<Record<Field, string>> = {}
    if (values.name.trim().length < 2) e.name = 'a name helps'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'that email looks off'
    if (values.message.trim().length < 10) e.message = 'tell me a little more'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) {
      gsap.fromTo('[data-form]', { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.25)' })
      return
    }
    const subject = encodeURIComponent(`Portfolio inquiry — ${values.name}`)
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const fieldCls = (f: Field) =>
    `peer w-full border-b bg-transparent py-4 text-[15px] outline-none transition-colors duration-500 placeholder:text-dim ${
      errors[f] ? 'border-red-400/70' : 'border-white/15 focus:border-electric'
    }`

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-24 md:py-36">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(closest-side, rgba(78,122,255,0.16), rgba(157,124,255,0.06) 55%, transparent 100%)' }} />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHead kicker="07 / Contact" title="Let’s build" accent="the unreasonable" />

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-[1.2fr_1fr]">
          {/* form */}
          <form data-form data-contact-reveal onSubmit={submit} noValidate className="space-y-9">
            {(['name', 'email'] as Field[]).map((f) => (
              <div key={f} className="group relative">
                <label htmlFor={f} className="kicker mb-1 block transition-colors group-focus-within:text-electric">
                  {f === 'name' ? 'Your name' : 'Your email'}
                </label>
                <input
                  id={f}
                  type={f === 'email' ? 'email' : 'text'}
                  value={values[f]}
                  onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                  placeholder={f === 'name' ? 'Ada Lovelace' : 'ada@analytical.engine'}
                  className={fieldCls(f)}
                />
                <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-electric to-glacier transition-transform duration-700 group-focus-within:scale-x-100" />
                {errors[f] && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">! {errors[f]}</p>}
              </div>
            ))}
            <div className="group relative">
              <label htmlFor="message" className="kicker mb-1 block transition-colors group-focus-within:text-electric">
                The mission
              </label>
              <textarea
                id="message"
                rows={4}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                placeholder="Tell me what shouldn’t exist yet…"
                className={`${fieldCls('message')} resize-none`}
              />
              <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-electric to-glacier transition-transform duration-700 group-focus-within:scale-x-100" />
              {errors.message && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">! {errors.message}</p>}
            </div>

            <Magnetic>
              <button
                type="submit"
                data-cursor="Send"
                className={`group relative overflow-hidden rounded-full px-9 py-4 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors duration-500 ${
                  sent ? 'bg-emerald-400 text-black' : 'bg-white text-black'
                }`}
              >
                {!sent && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-electric via-amethyst to-glacier transition-transform duration-500 group-hover:translate-x-0" />
                )}
                <span className={`relative flex items-center gap-2 transition-colors duration-500 ${!sent && 'group-hover:text-white'}`}>
                  {sent ? (
                    <>
                      <Check className="h-4 w-4" /> Opening your mail client
                    </>
                  ) : (
                    <>
                      Transmit <Send className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </span>
              </button>
            </Magnetic>
          </form>

          {/* direct channels */}
          <div data-contact-reveal className="flex flex-col justify-between gap-10">
            <div className="space-y-8">
              <p className="max-w-sm leading-relaxed text-mist">
                Prefer a direct line? The fastest way to reach me is the same place the
                code lives.
              </p>
              <div className="space-y-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open"
                  className="glass group flex items-center justify-between rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-4">
                    <Github className="h-5 w-5 text-electric" />
                    <span>
                      <span className="block text-sm text-white/90">github.com/salahmakboul</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">code, issues, signals</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-mist transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  data-cursor="Mail"
                  className="glass group flex items-center justify-between rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-4">
                    <Send className="h-5 w-5 text-glacier" />
                    <span>
                      <span className="block text-sm text-white/90">{EMAIL}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">old school, works</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-mist transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 ping-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-mist">
                currently accepting select projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
