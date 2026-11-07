import { useEffect, useRef, useState } from 'react'
import { config, withName } from '../lib/theme'
import { scrollToId } from '../lib/scroll'
import { Magnetic } from './Magnetic'
import { Botanical } from './Atmosphere'
import { splitHeadline } from '../lib/text'

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const x = event.clientX / window.innerWidth - 0.5
        const y = event.clientY / window.innerHeight - 0.5
        setTilt({ x, y })
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const headWords = splitHeadline(config.hero.headline)

  return (
    <section id="hero" ref={rootRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__wash" aria-hidden="true" />

      <Botanical
        className="hero__ornament"
        flip={false}
      />
      <Botanical className="hero__ornament hero__ornament--left" flip />

      <div className="hero__frame" aria-hidden="true">
        <span className="hero__frame-label">EST. {config.recipient.birthday.slice(0, 4)}</span>
        <span className="hero__frame-label">A keepsake, not a template</span>
      </div>

      <div
        className="hero__inner"
        style={{ transform: `translate3d(${tilt.x * -8}px, ${tilt.y * -6}px, 0)` }}
      >
        <p className="hero__kicker">
          <span className="hero__kicker-dot" aria-hidden="true" />
          {config.hero.eyebrow}
        </p>

        <h1 id="hero-title" className="hero__title display">
          {headWords.map((word, index) => (
            <span className="hero__word" key={`${word.text}-${index}`}>
              <span className="hero__word-inner">
                {word.accent ? <em>{word.text}</em> : word.text}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero__lower">
          <div className="hero__lede">
            <p className="hero__subline">{config.hero.subline}</p>
            <div className="hero__cta">
              <Magnetic>
                <button type="button" className="btn btn--solid" onClick={() => scrollToId('celebration')} data-cursor="Enter">
                  <span>{config.hero.primaryCta}</span>
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button type="button" className="btn btn--ghost" onClick={() => scrollToId('letter')} data-cursor="Read">
                  <span>{config.hero.secondaryCta}</span>
                </button>
              </Magnetic>
            </div>
          </div>

          <div className="hero__card" data-cursor="Hi">
            <div className="hero__card-head">
              <span className="hero__card-label">Guest of honour</span>
              <span className="hero__card-index">01</span>
            </div>
            <p className="hero__card-name script">
              {config.recipient.name}
            </p>
            <div className="hero__card-meta">
              <span>{withName(config.hero.kicker)}</span>
              <span aria-hidden="true">·</span>
              <span>{config.hero.sideNote}</span>
            </div>
            <div className="hero__card-line" aria-hidden="true" />
            <p className="hero__card-note">{config.hero.scrollCue}</p>
          </div>
        </div>
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollToId('celebration')} aria-label="Scroll to celebration">
        <span className="hero__scroll-text">{config.hero.scrollCue}</span>
        <span className="hero__scroll-line" aria-hidden="true">
          <span />
        </span>
      </button>
    </section>
  )
}
