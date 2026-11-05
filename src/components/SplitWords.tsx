interface SplitWordsProps {
  text: string
  className?: string
  accentWord?: string
}

export function SplitWords({ text, className, accentWord }: SplitWordsProps) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, index) => {
        const isAccent = accentWord !== undefined && word.toLowerCase() === accentWord.toLowerCase()
        return (
          <span className="sw" key={`${word}-${index}`}>
            <span className="sw__i">
              {isAccent ? <em>{word}</em> : word}
            </span>
            {index < words.length - 1 ? ' ' : null}
          </span>
        )
      })}
    </span>
  )
}
