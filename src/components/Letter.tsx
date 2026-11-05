import { useCallback, useEffect, useRef, useState } from 'react'
import { config, withName } from '../lib/theme'
import { Reveal } from './Reveal'

export function Letter() {
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(0)
  const [typing, setTyping] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const timers = useRef<number[]>([])
  const paragraphs = config.letter.paragraphs

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const revealAll = useCallback(() => {
    clearTimers()
    setTyping(false)
    setRevealed(paragraphs.length)
  }, [clearTimers, paragraphs.length])

  const revealNext = useCallback(() => {
    setRevealed((prev) => Math.min(paragraphs.length, prev + 1))
    setTyping(true)
  }, [paragraphs.length])

  useEffect(() => {
    if (!typing) return
    const timer = window.setTimeout(() => setTyping(false), 900)
    return () => window.clearTimeout(timer)
  }, [typing, revealed])

  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    paragraphs.forEach((_, index) => {
      const id = window.setTimeout(() => {
        setRevealed(index + 1)
        if (index === paragraphs.length - 1) setTyping(false)
      }, 620 + index * 900)
      timers.current.push(id)
    })
    return clearTimers
  }, [open, paragraphs, clearTimers])

  const openLetter = () => {
    clearTimers()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setRevealed(reduced ? paragraphs.length : 0)
    setOpen(true)
  }

  const seal = () => {
    clearTimers()
    setOpen(false)
    setRevealed(0)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  return (
    <section id="letter" ref={sectionRef} className="section letter" aria-labelledby="letter-title">
      <div className="letter__glow" aria-hidden="true" />
      <div className="section__inner letter__inner">
        <div className="letter__aside">
          <p className="eyebrow">{config.letter.eyebrow}</p>
          <h2 id="letter-title" className="section-title display letter__title">
            A letter, <em>sealed</em> for you
          </h2>
          <p className="body-copy letter__intro">{config.letter.intro}</p>

          <div className="letter__meta">
            <span className="letter__meta-row">
              <span className="letter__meta-key">To</span>
              <span className="letter__meta-val">{config.recipient.name}</span>
            </span>
            <span className="letter__meta-row">
              <span className="letter__meta-key">From</span>
              <span className="letter__meta-val">{config.letter.signature.replace(',', '')}</span>
            </span>
            <span className="letter__meta-row">
              <span className="letter__meta-key">Re</span>
              <span className="letter__meta-val">The occasion of you</span>
            </span>
          </div>

          <p className="letter__hint">
            {open ? 'Scroll inside the letter, or reveal it all at once.' : 'Break the wax seal whenever you are ready.'}
          </p>
        </div>

        <div className={`letter__paper${open ? ' is-open' : ''}`}>
          <div className="letter__dogear" aria-hidden="true" />

          {!open ? (
            <div className="letter__sealed">
              <div className="letter__wax" aria-hidden="true">
                <span>A</span>
              </div>
              <p className="letter__sealed-label">{config.letter.sealLabel}</p>
              <h3 className="letter__sealed-name script">{withName(config.letter.salutation)}</h3>
              <button type="button" className="btn btn--ghost letter__open-btn" onClick={openLetter}>
                <span>Open the letter</span>
              </button>
              <p className="letter__sealed-note">A few paragraphs, written slowly.</p>
            </div>
          ) : (
            <div className="letter__page" role="region" aria-label="The letter">
              <div className="letter__page-head">
                <span>{config.letter.eyebrow}</span>
                <span>{config.recipient.name} · {new Date().getFullYear()}</span>
              </div>

              <p className="letter__salutation script">{withName(config.letter.salutation)}</p>

              <div className="letter__body">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`letter__paragraph${index < revealed ? ' is-visible' : ''}${
                      typing && index === revealed - 1 ? ' is-typing' : ''
                    }`}
                  >
                    {withName(paragraph)}
                  </p>
                ))}
              </div>

              <div className={`letter__signoff${revealed >= paragraphs.length ? ' is-visible' : ''}`}>
                <p className="letter__closing script">{config.letter.closing}</p>
                <p className="letter__signature">{config.letter.signature}</p>
                <p className="letter__name script">{config.recipient.name}</p>
                <p className="letter__ps">{config.letter.postscript}</p>
              </div>

              <div className="letter__actions">
                {revealed < paragraphs.length ? (
                  <>
                    <button type="button" className="link-arrow" onClick={revealNext}>
                      Reveal the next line
                      <span aria-hidden="true">→</span>
                    </button>
                    <button type="button" className="link-arrow" onClick={revealAll}>
                      {config.letter.revealAll}
                      <span aria-hidden="true">→</span>
                    </button>
                  </>
                ) : (
                  <button type="button" className="link-arrow" onClick={seal}>
                    {config.letter.reseal}
                    <span aria-hidden="true">↺</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Reveal className="letter__footer" delay={120}>
        <p className="script letter__footer-quote">“{config.story.quote}”</p>
      </Reveal>
    </section>
  )
}
