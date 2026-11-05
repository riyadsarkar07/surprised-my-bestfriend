import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config } from '../lib/theme'
import { registerGsap } from '../lib/anim'
import { Reveal } from './Reveal'

export function Story() {
  const rootRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState(config.story.events[0]?.id ?? '')
  const events = config.story.events

  useEffect(() => {
    registerGsap()
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story__line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.story__track',
            start: 'top 62%',
            end: 'bottom 70%',
            scrub: 0.6,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('.story__event').forEach((event) => {
        gsap.fromTo(
          event,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: event, start: 'top 86%' },
          },
        )
        ScrollTrigger.create({
          trigger: event,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveId(event.dataset.id ?? ''),
          onEnterBack: () => setActiveId(event.dataset.id ?? ''),
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={rootRef} className="section story" aria-labelledby="story-title">
      <div className="section__inner">
        <div className="story__head">
          <div>
            <p className="eyebrow">{config.story.eyebrow}</p>
            <h2 id="story-title" className="section-title display story__title">
              How we <em>got here</em>
            </h2>
          </div>
          <div className="story__head-side">
            <p className="body-copy">{config.story.intro}</p>
            <blockquote className="story__quote script">
              <span aria-hidden="true">“</span>
              {config.story.quote}
            </blockquote>
          </div>
        </div>

        <div className="story__track">
          <div className="story__line" aria-hidden="true">
            <div className="story__line-fill" />
          </div>

          <ol className="story__events">
            {events.map((event, index) => (
              <li
                key={event.id}
                className={`story__event${activeId === event.id ? ' is-active' : ''}`}
                data-id={event.id}
              >
                <div className="story__node" aria-hidden="true">
                  <span />
                </div>

                <div className="story__event-year">
                  <span className="story__year script">{event.year}</span>
                  <span className="story__chapter">{String(index + 1).padStart(2, '0')} · {event.chapter}</span>
                </div>

                <div className="story__event-body">
                  <span className="story__tag">{event.tag}</span>
                  <h3 className="story__event-title display">{event.title}</h3>
                  <p className="story__event-desc">{event.description}</p>
                </div>

                {event.image ? (
                  <Reveal className="story__event-image" y={16}>
                    <img src={event.image} alt="" loading="lazy" decoding="async" />
                  </Reveal>
                ) : (
                  <div className="story__event-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
