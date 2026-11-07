import { Fragment } from 'react'

interface SplitWordsProps {
  text: string
  className?: string
  /** Word to italicise. Defaults to the last word when omitted. */
  accentWord?: string
}

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9']/g, '')
}

export function SplitWords({ text, className, accentWord }: SplitWordsProps) {
  const words = text.trim().split(/\s+/)
  const lastIndex = words.length - 1
  const accent = accentWord ? normalize(accentWord) : null

  return (
    <span className={className}>
      {words.map((word, index) => {
        const isAccent = accent ? normalize(word) === accent : index === lastIndex
        return (
          <Fragment key={`${word}-${index}`}>
            <span className="sw">
              <span className="sw__i">
                {isAccent ? <em>{word}</em> : word}
              </span>
            </span>
            {index < lastIndex ? ' ' : null}
          </Fragment>
        )
      })}
    </span>
  )
}
