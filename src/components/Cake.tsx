import { useCallback, useEffect, useRef, useState } from 'react'
import { config, withName } from '../lib/theme'
import { Reveal } from './Reveal'
import { useConfetti } from '../hooks/useConfetti'

interface CakeProps {
  onCelebrate: () => void
}

export function Cake({ onCelebrate }: CakeProps) {
  const count = Math.max(1, Math.min(12, config.cake.candles))
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: count }, () => true))
  const [holding, setHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [wish, setWish] = useState('')
  const [wishSaved, setWishSaved] = useState(false)
  const holdRaf = useRef(0)
  const holdStart = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const { canvasRef, fire } = useConfetti()

  const allOut = lit.every((v) => !v)

  const blowOut = useCallback(() => {
    setLit((prev) => prev.map(() => false))
    const root = rootRef.current
    if (root) {
      const rect = root.getBoundingClientRect()
      fire({ x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.35, count: 130, velocity: 12 })
    }
    onCelebrate()
  }, [fire, onCelebrate])

  const stopHold = useCallback(() => {
    cancelAnimationFrame(holdRaf.current)
    setHolding(false)
    setHoldProgress(0)
  }, [])

  const startHold = useCallback(() => {
    if (allOut) return
    setHolding(true)
    holdStart.current = performance.now()
    const tick = () => {
      const elapsed = performance.now() - holdStart.current
      const progress = Math.min(1, elapsed / 1600)
      setHoldProgress(progress)
      if (progress >= 1) {
        setHolding(false)
        setHoldProgress(0)
        blowOut()
        return
      }
      holdRaf.current = requestAnimationFrame(tick)
    }
    holdRaf.current = requestAnimationFrame(tick)
  }, [allOut, blowOut])

  useEffect(() => () => cancelAnimationFrame(holdRaf.current), [])

  const relight = () => {
    setLit((prev) => prev.map(() => true))
    setWishSaved(false)
  }

  const saveWish = (event: React.FormEvent) => {
    event.preventDefault()
    if (!wish.trim()) return
    try {
      sessionStorage.setItem('birthday-wish', wish.trim())
    } catch {
      /* private mode: wish simply stays in memory */
    }
    setWishSaved(true)
  }

  const toggleFlame = (index: number) => {
    setLit((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      if (next.every((v) => !v)) onCelebrate()
      return next
    })
  }

  return (
    <section id="cake" className="section cake" aria-labelledby="cake-title">
      <canvas ref={canvasRef} className="confetti-canvas confetti-canvas--local" aria-hidden="true" />
      <div className="section__inner cake__inner">
        <div className="cake__copy">
          <p className="eyebrow">{config.cake.eyebrow}</p>
          <h2 id="cake-title" className="section-title display">
            Make a <em>wish</em>
          </h2>
          <p className="body-copy cake__intro">{config.cake.intro}</p>

          <div className="cake__wish">
            {wishSaved ? (
              <div className="cake__wish-sealed" role="status">
                <span className="cake__wish-mark" aria-hidden="true">✦</span>
                <p>{config.cake.wishSealed}</p>
                <p className="cake__wish-echo script">“{wish}”</p>
              </div>
            ) : (
              <form onSubmit={saveWish} className="cake__wish-form">
                <label htmlFor="wish" className="cake__wish-label">{config.cake.wishLabel}</label>
                <div className="cake__wish-row">
                  <input
                    id="wish"
                    name="wish"
                    className="cake__wish-input"
                    value={wish}
                    onChange={(event) => setWish(event.target.value)}
                    placeholder={config.cake.wishPlaceholder}
                    maxLength={140}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn--ghost cake__wish-save" disabled={!wish.trim()}>
                    <span>Seal it</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="cake__actions">
            <button
              type="button"
              className={`btn btn--solid cake__hold${holding ? ' is-holding' : ''}`}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                startHold()
              }}
              onPointerUp={stopHold}
              onPointerCancel={stopHold}
              onPointerLeave={stopHold}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  startHold()
                }
              }}
              onKeyUp={stopHold}
              disabled={allOut}
            >
              <span>{holding ? config.cake.holdingCta : config.cake.holdCta}</span>
              <span className="cake__hold-fill" style={{ transform: `scaleX(${holdProgress})` }} aria-hidden="true" />
            </button>

            {allOut ? (
              <button type="button" className="btn btn--ghost" onClick={relight}>
                <span>{config.cake.relight}</span>
              </button>
            ) : null}
          </div>

          <p className="cake__hint">{config.cake.candleHint}</p>
        </div>

        <div className="cake__stage" ref={rootRef}>
          <div className={`cake__scene${allOut ? ' is-dark' : ''}`}>
            <span className="cake__glow" aria-hidden="true" />
            <div className="cake__candles" style={{ ['--n' as string]: count }}>
              {lit.map((isLit, index) => (
                <button
                  key={index}
                  type="button"
                  className={`candle${isLit ? ' is-lit' : ''}`}
                  onClick={() => toggleFlame(index)}
                  aria-pressed={isLit}
                  aria-label={`Candle ${index + 1}, ${isLit ? 'lit — tap to blow out' : 'out — tap to relight'}`}
                  style={{ ['--i' as string]: index }}
                >
                  <span className="candle__flame" aria-hidden="true">
                    <span className="candle__flame-core" />
                  </span>
                  <span className="candle__smoke" aria-hidden="true" />
                  <span className="candle__stick" aria-hidden="true">
                    <span className="candle__stripe" />
                  </span>
                </button>
              ))}
            </div>

            <div className="cake__tier cake__tier--top" aria-hidden="true">
              <span className="cake__icing" />
              <span className="cake__drip" />
              <span className="cake__sprinkles">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} style={{ ['--i' as string]: i }} />
                ))}
              </span>
            </div>
            <div className="cake__tier cake__tier--mid" aria-hidden="true">
              <span className="cake__icing" />
              <span className="cake__drip" />
            </div>
            <div className="cake__tier cake__tier--base" aria-hidden="true">
              <span className="cake__icing" />
              <span className="cake__drip" />
            </div>
            <div className="cake__plate" aria-hidden="true" />

            {allOut ? (
              <p className="cake__made-wish script" role="status">
                {withName(config.letter.closing)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <Reveal className="cake__footnote" delay={80}>
        <span>{lit.filter(Boolean).length} of {count} candles still burning</span>
        <span className="cake__footnote-mark" aria-hidden="true">✦</span>
        <span>The wish stays in this browser</span>
      </Reveal>
    </section>
  )
}
