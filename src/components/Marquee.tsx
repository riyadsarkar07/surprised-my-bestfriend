import { cn } from '../lib/cn'

interface MarqueeProps {
  items: string[]
  speed?: number
  className?: string
}

export function Marquee({ items, speed = 46, className }: MarqueeProps) {
  if (!items.length) return null
  const content = (
    <>
      {items.map((item, index) => (
        <span className="marquee__item" key={`${item}-${index}`}>
          <span>{item}</span>
          <span className="marquee__star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  )

  return (
    <div className={cn('marquee', className)} aria-hidden="true" style={{ ['--marquee-speed' as string]: `${speed}s` }}>
      <div className="marquee__track">
        {content}
        {content}
      </div>
    </div>
  )
}
