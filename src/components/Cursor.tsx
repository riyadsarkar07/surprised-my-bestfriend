import { useEffect, useRef, useState } from 'react'
import { useFinePointer } from '../hooks/useEnvironment'

export function Cursor() {
  const fine = useFinePointer()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!fine) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let raf = 0
    let visible = false

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX
      pos.y = event.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      const target = event.target as HTMLElement | null
      const interactive = target?.closest<HTMLElement>('a, button, [data-cursor]')
      if (interactive) {
        setHovered(true)
        setLabel(interactive.dataset.cursor ?? '')
      } else {
        setHovered(false)
        setLabel('')
      }
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const render = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.14
      ringPos.y += (pos.y - ringPos.y) * 0.14
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(render)
    }

    dot.style.opacity = '0'
    ring.style.opacity = '0'
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [fine])

  if (!fine) return null

  return (
    <div ref={dotRef} className={`cursor${hovered ? ' is-hover' : ''}`} aria-hidden="true">
      <span className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  )
}
