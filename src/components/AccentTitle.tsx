import { Fragment } from 'react'

interface AccentTitleProps {
  text: string
  id?: string
  className?: string
  /** Words (lowercase, punctuation-stripped) to italicise. Defaults to the last word. */
  accentWords?: string[]
  ariaLabel?: string
}

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9']/g, '')
}

/**
 * Renders a config-provided title with an italic accent word, keeping the
 * text in the DOM as real words for screen readers and text selection.
 */
export function AccentTitle({ text, id, className, accentWords, ariaLabel }: AccentTitleProps) {
  const words = text.trim().split(/\s+/)
  const accents = accentWords?.map(normalize)
  const lastIndex = words.length - 1

  return (
    <h2 id={id} className={className} aria-label={ariaLabel}>
      {words.map((word, index) => {
        const plain = normalize(word)
        const accent = accents ? accents.includes(plain) : index === lastIndex
        return (
          <Fragment key={`${word}-${index}`}>
            {accent ? <em>{word}</em> : word}
            {index < lastIndex ? ' ' : null}
          </Fragment>
        )
      })}
    </h2>
  )
}
