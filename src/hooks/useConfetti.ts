import { useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/anim'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  spin: number
  life: number
  ttl: number
  color: string
  shape: 'ribbon' | 'dot' | 'ring'
  drift: number
}

const PALETTE_KEYS = ['--accent', '--accent-soft', '--secondary', '--paper', '--glow'] as const

function readPalette(): string[] {
  if (typeof window === 'undefined') return ['#eab7a2']
  const styles = getComputedStyle(document.documentElement)
  return PALETTE_KEYS.map((key) => styles.getPropertyValue(key).trim()).filter(Boolean)
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const runningRef = useRef(false)

  const loop = useCallback(function tick() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    if (canvas.width !== Math.floor(window.innerWidth * dpr) || canvas.height !== Math.floor(window.innerHeight * dpr)) {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    const particles = particlesRef.current
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life += 1
      p.vy += 0.055
      p.vx *= 0.995
      p.vy *= 0.995
      p.x += p.vx + Math.sin((p.life + p.drift) * 0.03) * 0.5
      p.y += p.vy
      p.rotation += p.spin

      const progress = p.life / p.ttl
      const alpha = progress < 0.75 ? 1 : Math.max(0, 1 - (progress - 0.75) / 0.25)

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = alpha * 0.9
      ctx.fillStyle = p.color

      if (p.shape === 'ribbon') {
        ctx.fillRect(-p.size * 0.5, -p.size * 0.16, p.size, p.size * 0.32)
      } else if (p.shape === 'ring') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      if (p.life > p.ttl || p.y > window.innerHeight + 80) {
        particles.splice(i, 1)
      }
    }

    if (particles.length > 0) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      runningRef.current = false
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [])

  const fire = useCallback(
    (options?: { x?: number; y?: number; count?: number; spread?: number; velocity?: number }) => {
      const canvas = canvasRef.current
      if (!canvas) return
      if (prefersReducedMotion()) return
      const colors = readPalette()
      const count = options?.count ?? 110
      const originX = options?.x ?? window.innerWidth / 2
      const originY = options?.y ?? window.innerHeight * 0.55
      const velocity = options?.velocity ?? 13
      const spread = options?.spread ?? Math.PI * 2

      for (let i = 0; i < count; i++) {
        const angle = spread === Math.PI * 2 ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * spread
        const speed = velocity * (0.35 + Math.random() * 0.85)
        const shapeRoll = Math.random()
        particlesRef.current.push({
          x: originX + (Math.random() - 0.5) * 40,
          y: originY + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 6 + Math.random() * 12,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.22,
          life: 0,
          ttl: 110 + Math.random() * 90,
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#eab7a2',
          shape: shapeRoll > 0.72 ? 'ring' : shapeRoll > 0.34 ? 'ribbon' : 'dot',
          drift: Math.random() * 200,
        })
      }

      if (!runningRef.current) {
        runningRef.current = true
        rafRef.current = requestAnimationFrame(loop)
      }
    },
    [loop],
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { canvasRef, fire }
}
