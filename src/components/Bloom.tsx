import { useCallback, useEffect, useRef, useState } from 'react'
import { config, withName } from '../lib/theme'
import { prefersReducedMotion } from '../lib/anim'

interface BloomProps {
  onEnter: (options: { withSound: boolean }) => void
  audioEnabled: boolean
}

type Stage = 'bud' | 'bloomed' | 'opening'

const OUTER_PETALS = 8
const INNER_PETALS = 5

interface Mote {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  tw: number
  phase: number
  kind: 'gold' | 'petal'
  rot: number
  spin: number
}

export function Bloom({ onEnter, audioEnabled }: BloomProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState<Stage>('bud')
  const [leaving, setLeaving] = useState(false)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  useEffect(() => {
    if (reduced) {
      setStage('bloomed')
      return
    }
    let cancelled = false
    const start = () => {
      if (cancelled) return
      window.setTimeout(() => {
        if (!cancelled) setStage('bloomed')
      }, 260)
    }
    if (document.fonts?.ready) {
      void document.fonts.ready.then(start)
    } else {
      start()
    }
    const fallback = window.setTimeout(start, 900)
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [reduced])

  /* Golden motes + drifting petals, one lightweight canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (reduced) return

    const motes: Mote[] = []
    const spawn = (initial: boolean) => {
      const petal = Math.random() > 0.72
      motes.push({
        x: Math.random() * canvas.clientWidth,
        y: initial ? Math.random() * canvas.clientHeight : canvas.clientHeight + 20,
        r: petal ? 4 + Math.random() * 5 : 0.7 + Math.random() * 1.7,
        vx: (Math.random() - 0.5) * 0.22,
        vy: petal ? -(0.22 + Math.random() * 0.4) : -(0.12 + Math.random() * 0.4),
        a: petal ? 0.24 + Math.random() * 0.28 : 0.25 + Math.random() * 0.5,
        tw: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        kind: petal ? 'petal' : 'gold',
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.012,
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvas.clientWidth * dpr)
      canvas.height = Math.floor(canvas.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    for (let i = 0; i < 46; i++) spawn(true)

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 1000 / 40) return
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i]
        m.phase += 0.012
        m.x += m.vx + Math.sin(m.phase) * 0.25
        m.y += m.vy
        m.rot += m.spin

        if (m.kind === 'gold') {
          const alpha = m.a * (0.55 + Math.sin(m.phase * m.tw) * 0.45)
          ctx.globalAlpha = Math.max(0, alpha)
          ctx.fillStyle = '#d8ae68'
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.globalAlpha = m.a
          ctx.save()
          ctx.translate(m.x, m.y)
          ctx.rotate(m.rot)
          ctx.fillStyle = 'rgba(217, 149, 145, 0.85)'
          ctx.beginPath()
          ctx.ellipse(0, 0, m.r, m.r * 0.5, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        if (m.y < -30 || m.x < -40 || m.x > w + 40) {
          motes.splice(i, 1)
          if (motes.length < 54) spawn(false)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  const begin = useCallback(
    (withSound: boolean) => {
      if (stage === 'opening') return
      setStage('opening')
      if (prefersReducedMotion()) {
        onEnter({ withSound })
        return
      }
      setLeaving(true)
      window.setTimeout(() => onEnter({ withSound }), 820)
    },
    [onEnter, stage],
  )

  const skip = useCallback(() => {
    if (stage === 'opening') return
    setStage('opening')
    setLeaving(true)
    window.setTimeout(() => onEnter({ withSound: false }), 260)
  }, [onEnter, stage])

  const nameWords = config.recipient.name.split(' ')
  const bloomed = stage === 'bloomed' || stage === 'opening'

  return (
    <div
      ref={rootRef}
      className={`bloom${leaving ? ' is-leaving' : ''}`}
      data-bloomed={bloomed ? 'true' : 'false'}
      role="dialog"
      aria-modal="true"
      aria-label="Birthday welcome"
    >
      <div className="bloom__frame" aria-hidden="true" />
      <button type="button" className="bloom__skip" onClick={skip}>
        Skip intro
      </button>

      <canvas ref={canvasRef} className="bloom__canvas" aria-hidden="true" />

      <div className="bloom__stage">
        <div className="bloom__halo" aria-hidden="true" />

        <svg
          className="bloom__flower"
          viewBox="0 0 300 400"
          role="img"
          aria-label="A single rose blooming in warm morning light"
        >
          <defs>
            <radialGradient id="bloom-petal" cx="50%" cy="88%" r="82%">
              <stop offset="0" stopColor="#fdf1ec" />
              <stop offset="0.42" stopColor="#f3d3cf" />
              <stop offset="0.78" stopColor="#e4aca9" />
              <stop offset="1" stopColor="#d99591" />
            </radialGradient>
            <radialGradient id="bloom-petal-inner" cx="50%" cy="86%" r="80%">
              <stop offset="0" stopColor="#fff6f0" />
              <stop offset="0.5" stopColor="#f8dfd9" />
              <stop offset="1" stopColor="#e9b8b4" />
            </radialGradient>
            <radialGradient id="bloom-core" cx="42%" cy="38%" r="70%">
              <stop offset="0" stopColor="#f7e2b8" />
              <stop offset="0.6" stopColor="#e2bd7c" />
              <stop offset="1" stopColor="#b98a4e" />
            </radialGradient>
            <linearGradient id="bloom-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a9bfa4" />
              <stop offset="1" stopColor="#7f9a7d" />
            </linearGradient>
          </defs>

          <path
            className="bloom__stem"
            d="M150 214 C 146 268, 156 312, 150 392"
            strokeWidth="3"
          />
          <path
            className="bloom__leaf bloom__leaf--left"
            d="M148 300 C 112 292, 88 306, 74 330 C 104 338, 132 328, 148 300 Z"
            strokeWidth="2"
            fill="url(#bloom-leaf)"
          />
          <path
            className="bloom__leaf bloom__leaf--right"
            d="M152 336 C 186 326, 212 338, 228 362 C 198 372, 170 362, 152 336 Z"
            strokeWidth="2"
            fill="url(#bloom-leaf)"
          />

          <g className="bloom__petals bloom__petals--outer">
            {Array.from({ length: OUTER_PETALS }).map((_, i) => {
              const angle = (360 / OUTER_PETALS) * i
              return (
                <path
                  key={`outer-${i}`}
                  className="bloom__petal"
                  d="M150 150 C 128 126, 120 84, 150 46 C 180 84, 172 126, 150 150 Z"
                  fill="url(#bloom-petal)"
                  style={{
                    ['--a' as string]: `${angle}deg`,
                    ['--petal-delay' as string]: `${0.16 + i * 0.075}s`,
                  }}
                />
              )
            })}
          </g>

          <g className="bloom__petals bloom__petals--inner">
            {Array.from({ length: INNER_PETALS }).map((_, i) => {
              const angle = (360 / INNER_PETALS) * i + 24
              return (
                <path
                  key={`inner-${i}`}
                  className="bloom__petal bloom__petal--inner"
                  d="M150 150 C 136 132, 130 100, 150 72 C 170 100, 164 132, 150 150 Z"
                  fill="url(#bloom-petal-inner)"
                  style={{
                    ['--a' as string]: `${angle}deg`,
                    ['--petal-delay' as string]: `${0.55 + i * 0.07}s`,
                  }}
                />
              )
            })}
          </g>

          <circle className="bloom__core" cx="150" cy="150" r="17" fill="url(#bloom-core)" />
          <circle className="bloom__core" cx="150" cy="150" r="7" fill="#fff3d4" opacity="0.7" />
        </svg>

        <div className="bloom__copy">
          <p className="bloom__eyebrow">{withName(config.hero.eyebrow)}</p>
          <h1 className="bloom__title" aria-label={`Happy birthday, ${config.recipient.name}`}>
            {nameWords.map((word, index) => (
              <span key={`${word}-${index}`}>
                {index === 0 ? <em>{word}</em> : word}
                {index < nameWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="bloom__line">{withName(config.celebration.lead)}</p>
        </div>

        <div className="bloom__actions">
          {audioEnabled ? (
            <>
              <button type="button" className="btn btn--solid" onClick={() => begin(true)}>
                <span>Open your surprise</span>
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => begin(false)}>
                <span>Enter quietly</span>
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--solid" onClick={() => begin(false)}>
              <span>Open your surprise</span>
            </button>
          )}
        </div>

        <p className="bloom__note">Best with headphones · no autoplay, promise</p>
      </div>
    </div>
  )
}
