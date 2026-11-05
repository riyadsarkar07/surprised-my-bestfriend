import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config, formatBirthday, daysSinceBirthday } from '../lib/theme'
import { registerGsap } from '../lib/anim'
import { Reveal } from './Reveal'
import { SplitWords } from './SplitWords'
import { Marquee } from './Marquee'

interface CelebrationProps {
  onConfetti: () => void
}

export function Celebration({ onConfetti }: CelebrationProps) {
  const rootRef = useRef<HTMLElement>(null)
  const bigNumberRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGsap()
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.celebration__title .sw__i',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.055,
          scrollTrigger: { trigger: '.celebration__title', start: 'top 84%' },
        },
      )

      gsap.fromTo(
        '.celebration__stat',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: '.celebration__stats', start: 'top 88%' },
        },
      )

      gsap.to('.celebration__orb', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      if (bigNumberRef.current) {
        gsap.fromTo(
          bigNumberRef.current,
          { xPercent: 8 },
          {
            xPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          },
        )
      }
    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  const age = config.recipient.age
  const days = daysSinceBirthday()

  const stats = [
    { label: config.celebration.stats.age, value: age ? String(age) : '—' },
    { label: config.celebration.stats.days, value: days.toLocaleString('en-US') },
    { label: config.celebration.stats.reasons, value: String(config.reasons.items.length).padStart(2, '0') },
    { label: config.celebration.stats.candles, value: String(config.cake.candles).padStart(2, '0') },
  ]

  return (
    <section id="celebration" ref={rootRef} className="section celebration" aria-labelledby="celebration-title">
      <div className="celebration__orb" aria-hidden="true" />
      <div className="celebration__big-number" ref={bigNumberRef} aria-hidden="true">
        {age ? String(age) : 'XX'}
      </div>

      <div className="section__inner">
        <div className="section-head">
          <p className="eyebrow">{config.celebration.eyebrow}</p>
          <div className="celebration__headline">
            <h2 id="celebration-title" className="section-title celebration__title display">
              <SplitWords text={config.celebration.title} accentWord="brighter" />
            </h2>
            <p className="celebration__date">
              <span className="celebration__date-label">{config.celebration.dateLabel}</span>
              <span className="celebration__date-value script">{formatBirthday()}</span>
            </p>
          </div>
        </div>

        <div className="celebration__grid">
          <Reveal className="celebration__lead-wrap" delay={80}>
            <p className="lead">{config.celebration.lead}</p>
            <p className="body-copy celebration__body">{config.celebration.body}</p>
            <button type="button" className="btn btn--ghost celebration__burst" onClick={onConfetti} data-confetti>
              <span>
                <span className="celebration__burst-mark" aria-hidden="true" />
                {config.celebration.confettiCta}
              </span>
            </button>
          </Reveal>

          <div className="celebration__stats" aria-label="Birthday numbers">
            {stats.map((stat, index) => (
              <div className="celebration__stat" key={stat.label}>
                <span className="celebration__stat-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="celebration__stat-value">{stat.value}</span>
                <span className="celebration__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="celebration__ribbon" aria-hidden="true">
        <Marquee items={['happy birthday', config.recipient.name, 'a year of you', 'with love']} speed={38} />
      </div>
    </section>
  )
}
