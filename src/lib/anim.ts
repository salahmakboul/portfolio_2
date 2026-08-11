import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Split an element's text into span.chars (keeps words wrappable). */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const chars: HTMLElement[] = []
  for (const word of text.split(' ')) {
    const w = document.createElement('span')
    w.style.display = 'inline-block'
    w.style.whiteSpace = 'nowrap'
    w.setAttribute('aria-hidden', 'true')
    for (const c of word) {
      const s = document.createElement('span')
      s.className = 'inline-block will-change-transform'
      s.textContent = c
      w.appendChild(s)
      chars.push(s)
    }
    el.appendChild(w)
    el.appendChild(document.createTextNode(' '))
  }
  return chars
}

/** Split into words for scrub reveals. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const words: HTMLElement[] = []
  text.split(/\s+/).forEach((word) => {
    const s = document.createElement('span')
    s.className = 'inline-block will-change-[opacity,transform]'
    s.setAttribute('aria-hidden', 'true')
    s.textContent = word
    el.appendChild(s)
    el.appendChild(document.createTextNode(' '))
    words.push(s)
  })
  return words
}

/** Pointer-tracking CSS vars for .spot-card glow borders. */
export function bindSpotCards(scope: HTMLElement) {
  const cards = scope.querySelectorAll<HTMLElement>('.spot-card')
  const handlers: Array<[HTMLElement, (e: PointerEvent) => void]> = []
  cards.forEach((card) => {
    const fn = (e: PointerEvent) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    card.addEventListener('pointermove', fn)
    handlers.push([card, fn])
  })
  return () => handlers.forEach(([c, fn]) => c.removeEventListener('pointermove', fn))
}
