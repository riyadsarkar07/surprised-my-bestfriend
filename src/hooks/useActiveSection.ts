import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[], offset = 0.42): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) return

    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * offset
      let current = elements[0].id
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= line) current = el.id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids, offset])

  return active
}
