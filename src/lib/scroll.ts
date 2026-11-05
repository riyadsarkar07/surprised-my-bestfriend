import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(next: Lenis | null): void {
  instance = next
}

export function getLenis(): Lenis | null {
  return instance
}

export function scrollToId(id: string, offset = 0): void {
  if (typeof document === 'undefined') return
  const target = document.getElementById(id)
  if (!target) return
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.6 })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export function scrollToTop(): void {
  if (instance) {
    instance.scrollTo(0, { duration: 1.8 })
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
