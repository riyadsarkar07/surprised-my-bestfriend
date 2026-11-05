export interface HeadWord {
  text: string
  accent: boolean
}

export function splitHeadline(headline: string): HeadWord[] {
  const words = headline.trim().split(/\s+/)
  if (words.length === 0) return []
  const accentIndex = words.length > 2 ? words.length - 1 : 0
  return words.map((raw, index) => ({
    text: stripAsterisks(raw),
    accent: index === accentIndex || /\*/.test(raw),
  }))
}

export function stripAsterisks(text: string): string {
  return text.replaceAll('*', '')
}
