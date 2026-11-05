export type RelationshipMode = 'romantic' | 'bestFriend' | 'closeFriend'

export type MotionPersonality = 'silk' | 'spark' | 'ember'

export interface Palette {
  ink: string
  inkSoft: string
  text: string
  muted: string
  accent: string
  accentSoft: string
  secondary: string
  glow: string
  line: string
}

export interface RelationshipPreset {
  id: RelationshipMode
  label: string
  shortLabel: string
  palette: Palette
  motion: MotionPersonality
  atmosphereIntensity: number
  microcopy: {
    invitation: string
    enterWithSound: string
    enterQuietly: string
    celebrationKicker: string
    marquee: string[]
    letterIntro: string
    finaleKicker: string
    signature: string
    footer: string
  }
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption: string
  note: string
  date: string
  shape: 'portrait' | 'landscape' | 'wide' | 'square' | 'tall'
}

export interface TimelineEvent {
  id: string
  year: string
  chapter: string
  title: string
  description: string
  tag: string
  image?: string
}

export interface Reason {
  id: string
  title: string
  body: string
  tag: string
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  src: string
}

export interface BirthdayConfig {
  recipient: {
    name: string
    relationship: RelationshipMode
    birthday: string
    age?: number
    pronoun: 'her' | 'him' | 'them'
  }
  theme: {
    palette: Partial<Palette>
    grain: number
  }
  hero: {
    eyebrow: string
    headline: string
    subline: string
    kicker: string
    primaryCta: string
    secondaryCta: string
    scrollCue: string
    sideNote: string
  }
  celebration: {
    eyebrow: string
    title: string
    lead: string
    body: string
    confettiCta: string
    dateLabel: string
    stats: {
      age: string
      days: string
      reasons: string
      candles: string
    }
  }
  memories: {
    eyebrow: string
    title: string
    intro: string
    items: GalleryItem[]
  }
  story: {
    eyebrow: string
    title: string
    intro: string
    quote: string
    events: TimelineEvent[]
  }
  reasons: {
    eyebrow: string
    title: string
    intro: string
    items: Reason[]
  }
  letter: {
    eyebrow: string
    title: string
    intro: string
    sealLabel: string
    salutation: string
    paragraphs: string[]
    closing: string
    signature: string
    postscript: string
    revealAll: string
    reseal: string
  }
  cake: {
    eyebrow: string
    title: string
    intro: string
    holdCta: string
    holdingCta: string
    candleHint: string
    wishLabel: string
    wishPlaceholder: string
    wishSealed: string
    relight: string
    candles: number
  }
  finale: {
    eyebrow: string
    title: string
    message: string
    signature: string
    replayCta: string
    replayHint: string
  }
  music: {
    enabled: boolean
    tracks: MusicTrack[]
  }
}
