import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/anim'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, y = 26, once = true }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (prefersReducedMotion()) {
      element.style.opacity = '1'
      element.style.transform = 'none'
      return
    }

    element.style.opacity = '0'
    element.style.transform = `translate3d(0, ${y}px, 0)`
    element.style.transition = `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.style.opacity = '1'
            element.style.transform = 'translate3d(0, 0, 0)'
            if (once) observer.unobserve(element)
          } else if (!once) {
            element.style.opacity = '0'
            element.style.transform = `translate3d(0, ${y}px, 0)`
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, once, y])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
