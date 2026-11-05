import { useCallback, useRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.32 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const el = ref.current
      if (!el) return
      if (window.matchMedia('(pointer: coarse)').matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = el.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
    },
    [strength],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate3d(0, 0, 0)'
  }, [])

  return (
    <span
      ref={ref}
      className={cn('magnetic', className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  )
}
