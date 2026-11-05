import { useEffect } from 'react'
import { useConfetti } from '../hooks/useConfetti'

export function ConfettiCanvas() {
  const { canvasRef, fire } = useConfetti()

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const trigger = target?.closest<HTMLElement>('[data-confetti]')
      if (!trigger) return
      fire({ x: event.clientX, y: event.clientY, count: 90, velocity: 11 })
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [fire])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}
