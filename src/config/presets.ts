import type { RelationshipPreset, RelationshipMode } from './types'

/**
 * Floral Atelier palette — warm ivory paper, muted plum ink, dusty pink,
 * sage leaf and soft gold. Every preset shares the same paper base so the
 * whole site reads as one stationery set; only the floral accents shift.
 */
const PAPER = {
  ink: '#fff8f2',
  inkSoft: '#f6eceb',
  text: '#302d35',
  muted: '#796e7c',
  line: 'rgba(48, 45, 53, 0.13)',
}

export const relationshipPresets: Record<RelationshipMode, RelationshipPreset> = {
  romantic: {
    id: 'romantic',
    label: 'Romantic Partner',
    shortLabel: 'For my person',
    motion: 'silk',
    atmosphereIntensity: 1,
    palette: {
      ...PAPER,
      accent: '#d99591',
      accentSoft: '#f6dedb',
      secondary: '#8fa68e',
      glow: '#d8ae68',
    },
    microcopy: {
      invitation: 'For the person who made ordinary days feel written by hand.',
      enterWithSound: 'Open with sound',
      enterQuietly: 'Enter quietly',
      celebrationKicker: 'The day the world got softer',
      marquee: ['Happy birthday', 'my favourite person', 'another year of you', 'always you'],
      letterIntro: 'Some things are too large for a card.',
      finaleKicker: 'The last scene is always you.',
      signature: 'Yours, always.',
      footer: 'Made with love, for you.',
    },
  },
  bestFriend: {
    id: 'bestFriend',
    label: 'Best Friend',
    shortLabel: 'For my best friend',
    motion: 'spark',
    atmosphereIntensity: 1.05,
    palette: {
      ...PAPER,
      accent: '#d99591',
      accentSoft: '#f6dedb',
      secondary: '#8fa68e',
      glow: '#d8ae68',
    },
    microcopy: {
      invitation: 'For the person who makes every ordinary day worth remembering.',
      enterWithSound: 'Open with sound',
      enterQuietly: 'Enter quietly',
      celebrationKicker: 'The day the good times began',
      marquee: ['Happy birthday', 'partner in everything', 'another year of chaos', 'you, always'],
      letterIntro: 'Some things deserve more than a text.',
      finaleKicker: 'To many more chapters.',
      signature: 'Your person, always.',
      footer: 'Made with love, for my favourite human.',
    },
  },
  closeFriend: {
    id: 'closeFriend',
    label: 'Close Friend',
    shortLabel: 'For a dear friend',
    motion: 'ember',
    atmosphereIntensity: 0.9,
    palette: {
      ...PAPER,
      accent: '#8fa68e',
      accentSoft: '#e4ede2',
      secondary: '#d99591',
      glow: '#d8ae68',
    },
    microcopy: {
      invitation: 'For someone who makes the world a warmer place.',
      enterWithSound: 'Open with sound',
      enterQuietly: 'Enter quietly',
      celebrationKicker: 'A day worth marking',
      marquee: ['Happy birthday', "here's to you", 'another beautiful year', 'with love'],
      letterIntro: 'A few words, kept for the right moment.',
      finaleKicker: "Here's to the year ahead.",
      signature: 'With warmth, always.',
      footer: 'Made with care, for you.',
    },
  },
}
