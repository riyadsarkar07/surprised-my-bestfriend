import { birthdayConfig } from '../config/birthday'
import { relationshipPresets } from '../config/presets'
import type { BirthdayConfig, Palette, RelationshipPreset } from '../config/types'

export const config: BirthdayConfig = birthdayConfig
export const preset: RelationshipPreset = relationshipPresets[config.recipient.relationship]

export const palette: Palette = { ...preset.palette, ...config.theme.palette }

function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const n = Number.parseInt(full, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export function cssVarsFromPalette(p: Palette): Record<string, string> {
  return {
    '--ink': p.ink,
    '--ink-soft': p.inkSoft,
    '--paper': p.text,
    '--muted': p.muted,
    '--accent': p.accent,
    '--accent-soft': p.accentSoft,
    '--secondary': p.secondary,
    '--glow': p.glow,
    '--line': p.line,
    '--accent-rgb': hexToRgbTriplet(p.accent),
    '--secondary-rgb': hexToRgbTriplet(p.secondary),
    '--glow-rgb': hexToRgbTriplet(p.glow),
    '--ink-rgb': hexToRgbTriplet(p.ink),
    '--text-rgb': hexToRgbTriplet(p.text),
  }
}

export function applyThemeToDocument(): void {
  const root = document.documentElement
  const vars = cssVarsFromPalette(palette)
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
  root.style.setProperty('--grain-opacity', String(config.theme.grain))
  root.dataset.motion = preset.motion
  root.dataset.relationship = preset.id
}

export function withName(input: string): string {
  return input.replaceAll('{name}', config.recipient.name)
}

export function parseBirthday(): Date {
  const [year, month, day] = config.recipient.birthday.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function formatBirthday(locale = 'en-US'): string {
  return parseBirthday().toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatBirthdayShort(locale = 'en-US'): string {
  return parseBirthday().toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

export function daysSinceBirthday(now = new Date()): number {
  const birth = parseBirthday()
  const diff = now.getTime() - birth.getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export function birthdayOrdinal(age: number): string {
  const mod100 = age % 100
  const mod10 = age % 10
  if (mod100 >= 11 && mod100 <= 13) return `${age}th`
  if (mod10 === 1) return `${age}st`
  if (mod10 === 2) return `${age}nd`
  if (mod10 === 3) return `${age}rd`
  return `${age}th`
}

export function pad(value: number, size = 2): string {
  return String(value).padStart(size, '0')
}
