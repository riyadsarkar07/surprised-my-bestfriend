import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'
import { config } from '../lib/theme'
import { registerGsap } from '../lib/anim'
import type { GalleryItem } from '../config/types'
import { Reveal } from './Reveal'

export function Memories() {
  const rootRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const items = config.memories.items
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    registerGsap()
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.memory').forEach((card) => {
        const image = card.querySelector('.memory__img')
        gsap.fromTo(
          card,
          { clipPath: 'inset(14% 6% 14% 6% round 4px)', opacity: 0.2 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 4px)',
            opacity: 1,
            duration: 1.3,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          },
        )
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.18 },
            {
              scale: 1,
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 90%' },
            },
          )
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const close = useCallback(() => {
    setActiveIndex(null)
    lastFocused.current?.focus()
  }, [])

  const step = useCallback(
    (direction: number) => {
      setActiveIndex((prev) => {
        if (prev === null) return prev
        return (prev + direction + items.length) % items.length
      })
    },
    [items.length],
  )

  useEffect(() => {
    if (activeIndex === null) return
    document.body.classList.add('is-locked')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
    }, 60)

    return () => {
      document.body.classList.remove('is-locked')
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [activeIndex, close, step])

  const open = (index: number) => {
    lastFocused.current = document.activeElement as HTMLElement | null
    setActiveIndex(index)
  }

  const active = activeIndex !== null ? items[activeIndex] : null

  return (
    <section id="memories" ref={rootRef} className="section memories" aria-labelledby="memories-title">
      <div className="section__inner">
        <div className="section-head">
          <p className="eyebrow">{config.memories.eyebrow}</p>
          <div className="section-head__row">
            <h2 id="memories-title" className="section-title display">
              Frames worth <em>keeping</em>
            </h2>
            <p className="body-copy memories__intro">{config.memories.intro}</p>
          </div>
          <hr className="rule" />
        </div>

        <div className="memories__grid">
          {items.map((item, index) => (
            <MemoryCard key={item.id} item={item} index={index} onOpen={() => open(index)} />
          ))}
        </div>

        <Reveal className="memories__footnote" delay={80}>
          <span className="memories__count">{String(items.length).padStart(2, '0')} frames</span>
          <span className="memories__hint">Click any frame to open it full-screen. Arrow keys to move.</span>
        </Reveal>
      </div>

      {active ? (
        <div className="lightbox" role="presentation" onClick={close}>
          <div
            className="lightbox__panel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.caption} — memory ${String((activeIndex ?? 0) + 1)} of ${items.length}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="lightbox__close" onClick={close} aria-label="Close memory">
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="lightbox__visual">
              <img src={active.src} alt={active.alt} decoding="async" />
              <span className="lightbox__index">
                {String((activeIndex ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
            </div>

            <div className="lightbox__meta">
              <p className="lightbox__date">{active.date}</p>
              <h3 className="lightbox__caption display">{active.caption}</h3>
              <p className="lightbox__note">{active.note}</p>
              <div className="lightbox__controls">
                <button type="button" className="lightbox__nav" onClick={() => step(-1)} aria-label="Previous memory">
                  <ArrowLeft size={16} strokeWidth={1.5} />
                  <span>Previous</span>
                </button>
                <button type="button" className="lightbox__nav" onClick={() => step(1)} aria-label="Next memory">
                  <span>Next</span>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function MemoryCard({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const el = btnRef.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: py * -5, ry: px * 6 })
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={`memory memory--${item.shape}`}
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      data-cursor="View"
      aria-label={`Open memory: ${item.caption}`}
    >
      <span className="memory__media" style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}>
        <img className="memory__img" src={item.src} alt={item.alt} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />
        <span className="memory__sheen" aria-hidden="true" />
        <span className="memory__open" aria-hidden="true">
          <Maximize2 size={15} strokeWidth={1.5} />
        </span>
      </span>
      <span className="memory__caption-row">
        <span className="memory__caption">{item.caption}</span>
        <span className="memory__no">{String(index + 1).padStart(2, '0')}</span>
      </span>
    </button>
  )
}
