import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { config, preset, withName } from '../lib/theme'
import { prefersReducedMotion } from '../lib/anim'

interface IntroProps {
  onEnter: (options: { withSound: boolean }) => void
  audioEnabled: boolean
}

type Stage = 'loading' | 'invitation' | 'opening'

export function Intro({ onEnter, audioEnabled }: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLButtonElement>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  useEffect(() => {
    const total = 1500
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        window.setTimeout(() => setStage('invitation'), reduced ? 60 : 320)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return
    gsap.to(fill, { scaleX: progress, duration: 0.35, ease: 'power2.out', overwrite: true })
    if (countRef.current) {
      countRef.current.textContent = String(Math.round(progress * 100)).padStart(3, '0')
    }
  }, [progress])

  useEffect(() => {
    if (stage !== 'invitation' || !contentRef.current) return
    contentRef.current.dataset.entered = 'true'
  }, [stage])

  const begin = (withSound: boolean) => {
    if (stage === 'opening') return
    setStage('opening')
    const envelope = envelopeRef.current
    const root = rootRef.current
    if (!envelope || !root) {
      onEnter({ withSound })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setLeaving(true)
        window.setTimeout(() => onEnter({ withSound }), 780)
      },
    })

    tl.to(envelope, { scale: 1.03, duration: 0.5, ease: 'power2.out' })
      .add(() => envelope.classList.add('is-open'))
      .to('.intro__invitation, .intro__note, .intro__actions, .envelope__hint', {
        opacity: 0,
        y: -14,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.35)
      .to(contentRef.current, { scale: 0.94, opacity: 0, duration: 1.1, ease: 'power3.inOut' }, 0.75)
      .to(root, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 1.05)
  }

  const skip = () => {
    if (stage === 'opening') return
    setStage('opening')
    setLeaving(true)
    window.setTimeout(() => onEnter({ withSound: false }), 220)
  }

  const nameWords = config.recipient.name.split(' ')

  return (
    <div
      ref={rootRef}
      className={`intro${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Birthday invitation"
    >
      <div className="intro__veil" aria-hidden="true" />
      <div className="intro__frame" aria-hidden="true" />
      <button type="button" className="intro__skip" onClick={skip}>
        Skip intro
      </button>

      <div className="intro__inner" ref={contentRef}>
        {stage === 'loading' ? (
          <div className="intro__loading" aria-live="polite">
            <span className="eyebrow">Now showing</span>
            <span className="intro__count" ref={countRef}>000</span>
            <p className="intro__loading-label">Preparing the room</p>
            <div className="intro__loading-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
              <div className="intro__loading-fill" ref={fillRef} />
            </div>
          </div>
        ) : (
          <div className="intro__envelope-stage">
            <span className="eyebrow intro__reveal eyebrow--center">{preset.microcopy.invitation}</span>

            <h1 className="intro__name" aria-label={`Happy birthday, ${config.recipient.name}`}>
              {nameWords.map((word, index) => (
                <span className="intro__name-word" key={`${word}-${index}`} aria-hidden="true">
                  <span>
                    {index === 0 ? <em>{word}</em> : word}
                    {index < nameWords.length - 1 ? '\u00A0' : ''}
                  </span>
                </span>
              ))}
            </h1>

            <p className="intro__invitation intro__reveal">{withName(preset.microcopy.celebrationKicker)}. {config.celebration.lead}</p>

            <button
              ref={envelopeRef}
              type="button"
              className="envelope"
              onClick={() => begin(audioEnabled)}
              aria-label="Open your surprise"
            >
              <span className="envelope__body" aria-hidden="true" />
              <span className="envelope__flap" aria-hidden="true" />
              <span className="envelope__seal" aria-hidden="true">A</span>
              <span className="envelope__hint">Open your surprise</span>
            </button>

            <div className="intro__actions intro__reveal">
              {audioEnabled ? (
                <>
                  <button type="button" className="btn btn--solid" onClick={() => begin(true)}>
                    <span>{preset.microcopy.enterWithSound}</span>
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => begin(false)}>
                    <span>{preset.microcopy.enterQuietly}</span>
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn--solid" onClick={() => begin(false)}>
                  <span>Enter the evening</span>
                </button>
              )}
            </div>

            <p className="intro__note intro__reveal">Best experienced with headphones · No autoplay, promise</p>
          </div>
        )}
      </div>
    </div>
  )
}
