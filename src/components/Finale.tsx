import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { config, withName } from '../lib/theme'
import { registerGsap } from '../lib/anim'
import { scrollToTop } from '../lib/scroll'
import { Reveal } from './Reveal'

export function Finale() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGsap()
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.finale__word > span',
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.finale__title', start: 'top 82%' },
        },
      )
      gsap.fromTo(
        '.finale__seal',
        { scale: 0.4, opacity: 0, rotate: -18 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.3,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: root, start: 'top 74%' },
        },
      )
      gsap.fromTo(
        '.finale__glow',
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 70%' },
        },
      )
      gsap.to('.finale__stars', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const words = config.finale.title.split(' ')

  return (
    <section id="finale" ref={rootRef} className="section finale" aria-labelledby="finale-title">
      <div className="finale__glow" aria-hidden="true" />
      <div className="finale__stars" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, index) => (
          <span
            key={index}
            style={{
              ['--x' as string]: `${(index * 37) % 100}%`,
              ['--y' as string]: `${(index * 53) % 100}%`,
              ['--d' as string]: `${1.6 + (index % 7) * 0.5}s`,
              ['--s' as string]: `${1 + (index % 4) * 0.5}px`,
            }}
          />
        ))}
      </div>

      <div className="section__inner finale__inner">
        <div className="finale__seal" aria-hidden="true">
          <span className="finale__seal-ring" />
          <span className="finale__seal-letter">{config.recipient.name.charAt(0)}</span>
        </div>

        <p className="eyebrow eyebrow--center">{config.finale.eyebrow}</p>

        <h2 id="finale-title" className="finale__title display" aria-label={config.finale.title}>
          {words.map((word, index) => (
            <span className="finale__word" key={`${word}-${index}`} aria-hidden="true">
              <span>{index === words.length - 1 ? <em>{word}</em> : word}</span>
              {index < words.length - 1 ? <span className="finale__space"> </span> : null}
            </span>
          ))}
        </h2>

        <Reveal className="finale__message" delay={140}>
          <p className="lead">{withName(config.finale.message)}</p>
        </Reveal>

        <div className="finale__signature">
          <span className="finale__sig-line" aria-hidden="true" />
          <p className="script">{withName(config.finale.signature)}</p>
          <span className="finale__sig-line" aria-hidden="true" />
        </div>

        <div className="finale__actions">
          <button type="button" className="btn btn--solid" onClick={scrollToTop}>
            <span>{config.finale.replayCta}</span>
          </button>
          <p className="finale__hint">{config.finale.replayHint}</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand">
            {config.recipient.name} <span aria-hidden="true">·</span> {new Date().getFullYear()}
          </span>
          <span className="footer__note">{withName(config.finale.signature)}</span>
          <span className="footer__credit">Designed as a keepsake, not a template.</span>
        </div>
      </footer>
    </section>
  )
}
