import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import { applyThemeToDocument, config, palette, preset } from './lib/theme'
import { registerGsap } from './lib/anim'
import { setLenis } from './lib/scroll'
import { useAudioEngine } from './hooks/useAudioEngine'
import { Intro } from './components/Intro'
import { ShaderBackdrop } from './components/ShaderBackdrop'
import { Chrome } from './components/Chrome'
import { Cursor } from './components/Cursor'
import { Hero } from './components/Hero'
import { Celebration } from './components/Celebration'
import { Memories } from './components/Memories'
import { Story } from './components/Story'
import { Reasons } from './components/Reasons'
import { Letter } from './components/Letter'
import { Cake } from './components/Cake'
import { Finale } from './components/Finale'
import { ConfettiCanvas } from './components/ConfettiCanvas'
import { MusicPlayer } from './components/MusicPlayer'
import { useConfetti } from './hooks/useConfetti'

type Phase = 'intro' | 'entering' | 'main'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const appRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const audio = useAudioEngine({ tracks: config.music.tracks, enabled: config.music.enabled })
  const { canvasRef: pageConfettiRef, fire: firePageConfetti } = useConfetti()

  useEffect(() => {
    applyThemeToDocument()
    registerGsap()
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (phase !== 'main') return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  useEffect(() => {
    if (phase !== 'main') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.35,
    })
    setLenis(lenis)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [phase])

  const handleEnter = useCallback(
    ({ withSound }: { withSound: boolean }) => {
      setPhase('entering')
      document.body.classList.remove('is-locked')
      window.scrollTo(0, 0)

      if (withSound && config.music.enabled) {
        void audio.play()
      }

      const curtain = curtainRef.current
      const app = appRef.current
      const finish = () => setPhase('main')

      if (!curtain || !app) {
        finish()
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish()
        return
      }

      const panels = curtain.querySelectorAll('.reveal-curtain__panel')
      const monogram = curtain.querySelector('.reveal-curtain__monogram')
      gsap.set(curtain, { display: 'grid' })
      gsap.set(panels, { yPercent: 0 })
      gsap.set(monogram, { opacity: 0, scale: 0.94 })
      gsap.set(app, { opacity: 0 })

      const tl = gsap.timeline({ onComplete: finish })
      tl.to(monogram, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' })
        .to(monogram, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.42')
        .to(panels, { yPercent: -101, duration: 1.5, ease: 'expo.inOut', stagger: 0.08 }, '-=0.1')
        .to(app, { opacity: 1, duration: 1.1, ease: 'power2.out' }, '-=0.95')
        .set(curtain, { display: 'none' })
    },
    [audio],
  )

  const celebrate = useCallback(() => {
    firePageConfetti({ count: 150, velocity: 14 })
  }, [firePageConfetti])

  const burst = useCallback(() => {
    firePageConfetti({ count: 140, velocity: 13, y: window.innerHeight * 0.5 })
  }, [firePageConfetti])

  return (
    <>
      <a className="skip-link" href="#hero">Skip to content</a>

      <div className="app-shell" ref={appRef} data-phase={phase}>
        <ShaderBackdrop palette={palette} intensity={preset.atmosphereIntensity} targetRef={appRef} />
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        {phase !== 'intro' ? (
          <>
            <Cursor />
            <Chrome audio={audio} visible={phase === 'main'} />
            <ConfettiCanvas />

            <main id="main">
              <Hero />
              <Celebration onConfetti={burst} />
              <Memories />
              <Story />
              <Reasons />
              <Letter />
              <Cake onCelebrate={celebrate} />
              <Finale />
            </main>

            <MusicPlayer audio={audio} visible={phase === 'main'} />
          </>
        ) : null}

        <noscript>
          <div className="noscript">This experience needs JavaScript enabled.</div>
        </noscript>

        <canvas ref={pageConfettiRef} className="sr-only" aria-hidden="true" />
      </div>

      <div className="reveal-curtain" ref={curtainRef} aria-hidden="true">
        <div className="reveal-curtain__panel" />
        <div className="reveal-curtain__panel" />
        <div className="reveal-curtain__monogram">
          {config.recipient.name.split(' ')[0]}
        </div>
      </div>

      {phase === 'intro' ? <Intro onEnter={handleEnter} audioEnabled={config.music.enabled} /> : null}
    </>
  )
}
