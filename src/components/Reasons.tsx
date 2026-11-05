import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import { config } from '../lib/theme'
import { Reveal } from './Reveal'
import { Magnetic } from './Magnetic'

export function Reasons() {
  const items = config.reasons.items
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i))
  const [cursor, setCursor] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const activeIndex = order[cursor] ?? 0
  const active = items[activeIndex]

  const go = useCallback(
    (delta: number) => {
      setFlipped(false)
      setCursor((prev) => (prev + delta + items.length) % items.length)
    },
    [items.length],
  )

  const shuffle = useCallback(() => {
    if (shuffling) return
    setShuffling(true)
    setFlipped(false)
    const card = cardRef.current
    if (card && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.animate(
        [
          { transform: 'rotate(0deg) translateY(0)', opacity: 1 },
          { transform: 'rotate(-3deg) translateY(-14px)', opacity: 0.4, offset: 0.4 },
          { transform: 'rotate(3deg) translateY(8px)', opacity: 0, offset: 0.7 },
          { transform: 'rotate(0deg) translateY(0)', opacity: 1 },
        ],
        { duration: 620, easing: 'cubic-bezier(0.76, 0, 0.24, 1)' },
      )
    }
    window.setTimeout(() => {
      const next = [...order]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
      setOrder(next)
      setCursor(0)
      setShuffling(false)
    }, 320)
  }, [order, shuffling])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const stack = useMemo(
    () => [0, 1, 2].map((offset) => ({ offset, index: order[(cursor + offset) % order.length] ?? 0 })),
    [cursor, order],
  )

  if (!active) return null

  return (
    <section id="reasons" className="section reasons" aria-labelledby="reasons-title">
      <div className="reasons__halo" aria-hidden="true" />
      <div className="section__inner">
        <div className="section-head">
          <p className="eyebrow">{config.reasons.eyebrow}</p>
          <div className="section-head__row">
            <h2 id="reasons-title" className="section-title display">
              A deck of <em>reasons</em>
            </h2>
            <p className="body-copy reasons__intro">{config.reasons.intro}</p>
          </div>
        </div>

        <div className="reasons__stage">
          <div className="reasons__deck" aria-live="polite">
            {stack
              .slice()
              .reverse()
              .map(({ offset, index }) => {
                const item = items[index]
                if (!item) return null
                const isTop = offset === 0
                return (
                  <div
                    key={`${item.id}-${offset}`}
                    ref={isTop ? cardRef : undefined}
                    className={`reason-card${isTop ? ' is-top' : ''}${isTop && flipped ? ' is-flipped' : ''}`}
                    style={{
                      ['--offset' as string]: offset,
                      zIndex: 10 - offset,
                      transform: isTop
                        ? undefined
                        : `translate3d(${offset * 16}px, ${offset * -12}px, 0) rotate(${offset * 1.6}deg) scale(${1 - offset * 0.035})`,
                    }}
                    aria-hidden={!isTop}
                  >
                    <div
                      className="reason-card__face reason-card__face--front"
                      aria-hidden={isTop && flipped}
                    >
                      <div className="reason-card__edge" aria-hidden="true" />
                      <span className="reason-card__no">{String(index + 1).padStart(2, '0')}</span>
                      <span className="reason-card__tag">{item.tag}</span>
                      <h3 className="reason-card__title display">{item.title}</h3>
                      <div className="reason-card__foot">
                        <button
                          type="button"
                          className="reason-card__open"
                          onClick={() => isTop && setFlipped(true)}
                          tabIndex={isTop && !flipped ? 0 : -1}
                        >
                          Read the note
                        </button>
                        <span className="reason-card__mark" aria-hidden="true">✦</span>
                      </div>
                    </div>

                    <div
                      className="reason-card__face reason-card__face--back"
                      aria-hidden={!isTop || !flipped}
                    >
                      <div className="reason-card__edge" aria-hidden="true" />
                      <span className="reason-card__tag">{item.tag}</span>
                      <p className="reason-card__body">{item.body}</p>
                      <div className="reason-card__foot">
                        <button
                          type="button"
                          className="reason-card__open"
                          onClick={() => isTop && setFlipped(false)}
                          tabIndex={isTop && flipped ? 0 : -1}
                        >
                          Turn back
                        </button>
                        <span className="reason-card__sig script">from me, to you</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="reasons__controls">
            <div className="reasons__nav">
              <button type="button" className="btn btn--icon btn--ghost" onClick={() => go(-1)} aria-label="Previous reason">
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
              <span className="reasons__count">
                {String(cursor + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(items.length).padStart(2, '0')}
              </span>
              <button type="button" className="btn btn--icon btn--ghost" onClick={() => go(1)} aria-label="Next reason">
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            <Magnetic strength={0.18}>
              <button type="button" className="btn btn--ghost reasons__shuffle" onClick={shuffle}>
                <span>
                  <Shuffle size={14} strokeWidth={1.6} aria-hidden="true" />
                  Shuffle the deck
                </span>
              </button>
            </Magnetic>
          </div>

          <div className="reasons__rail" aria-hidden="true">
            {items.map((item, index) => (
              <span key={item.id} className={`reasons__rail-dot${index === activeIndex ? ' is-active' : ''}`} />
            ))}
          </div>
        </div>

        <Reveal className="reasons__foot" delay={60}>
          <p className="reasons__foot-text">{items.length} reasons, and not one of them the whole story.</p>
        </Reveal>
      </div>
    </section>
  )
}
