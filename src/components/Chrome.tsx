import { useEffect, useRef, useState } from 'react'
import { config } from '../lib/theme'
import { scrollToId } from '../lib/scroll'
import { useActiveSection } from '../hooks/useActiveSection'
import type { AudioEngine } from '../hooks/useAudioEngine'
import { Flame, Pause, Play, VolumeX } from 'lucide-react'

const CHAPTERS = [
  { id: 'hero', label: 'Opening' },
  { id: 'celebration', label: 'Celebration' },
  { id: 'memories', label: 'Memories' },
  { id: 'story', label: 'Story' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'letter', label: 'Letter' },
  { id: 'cake', label: 'Cake' },
  { id: 'finale', label: 'Finale' },
]

const NAV_LINKS = [
  { id: 'celebration', label: 'Celebration' },
  { id: 'memories', label: 'Memories' },
  { id: 'story', label: 'Story' },
  { id: 'letter', label: 'Letter' },
  { id: 'cake', label: 'Cake' },
]

interface ChromeProps {
  audio: AudioEngine
  visible: boolean
}

export function Chrome({ audio, visible }: ChromeProps) {
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(CHAPTERS.map((c) => c.id))
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const monogram = config.recipient.name.slice(0, 1).toUpperCase()
  const SoundIcon = audio.muted || audio.volume === 0 ? VolumeX : audio.playing ? Pause : Play

  return (
    <>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      {visible ? (
        <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
          <button type="button" className="nav__brand" onClick={() => scrollToId('hero')} aria-label="Back to the opening">
            <span className="nav__monogram" aria-hidden="true">{monogram}</span>
            <span>
              {config.recipient.name}
              <span className="nav__chapter">{CHAPTERS.find((c) => c.id === active)?.label ?? 'Opening'}</span>
            </span>
          </button>

          <nav className="nav__links" aria-label="Chapters">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`nav__link${active === link.id ? ' is-active' : ''}`}
                onClick={() => scrollToId(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="nav__actions">
            <button
              type="button"
              className="nav__sound"
              onClick={() => void audio.toggle()}
              aria-pressed={audio.playing}
              aria-label={audio.playing ? 'Pause the soundtrack' : 'Play the soundtrack'}
            >
              <SoundIcon size={15} strokeWidth={1.6} aria-hidden="true" />
              <span className="nav__sound-label">{audio.playing ? 'Sound on' : 'Sound off'}</span>
            </button>
            <button
              type="button"
              className="nav__sound"
              onClick={() => scrollToId('cake')}
              aria-label="Skip to the cake"
            >
              <Flame size={15} strokeWidth={1.6} aria-hidden="true" />
              <span className="nav__sound-label">Cake</span>
            </button>
          </div>
        </header>
      ) : null}

      <aside className="chapter-rail" aria-label="Chapter navigation">
        {CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={`chapter-rail__item${active === chapter.id ? ' is-active' : ''}`}
            onClick={() => scrollToId(chapter.id)}
            aria-current={active === chapter.id ? 'true' : undefined}
          >
            <span className="chapter-rail__label">
              {String(index).padStart(2, '0')} {chapter.label}
            </span>
            <span className="chapter-rail__bar" aria-hidden="true" />
          </button>
        ))}
      </aside>
    </>
  )
}
