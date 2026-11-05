# A Year of You — a cinematic birthday experience

A private, interactive birthday site: an opening sequence, a gallery of memories, a
scroll-scrubbed timeline, a deck of reasons, a sealed letter, a cake with real candles,
and a finale — all wrapped in a custom WebGL aurora, self-hosted typography, and a
built-in ambient soundtrack.

Everything personal lives in one file. No database, no accounts, no external services.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check, then build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run typecheck` | Type-check without emitting files |

Requires Node 20+ (built and verified on Node 22).

---

## Make it yours

Almost every word on the site is editable from a single file:

**`src/config/birthday.ts`**

### 1. The person

```ts
recipient: {
  name: 'Aria',
  relationship: 'romantic',   // 'romantic' | 'bestFriend' | 'closeFriend'
  birthday: '1998-08-14',     // YYYY-MM-DD
  age: 27,
  pronoun: 'her',             // 'her' | 'him' | 'them'
},
```

Changing `relationship` switches the whole visual mood — palette, accent colours,
motion personality, and the microcopy used in the intro, marquee and finale. The three
presets live in `src/config/presets.ts` and can be tuned there.

`{name}` inside any headline, salutation or signature is replaced with
`recipient.name` automatically.

### 2. The sections

Each section in the config maps to one chapter of the page:

| Config key | Section on the page |
| --- | --- |
| `hero` | Opening screen, headline, calls to action |
| `celebration` | "The world got a little brighter", stats |
| `memories` | Masonry gallery + lightbox |
| `story` | Scroll-scrubbed timeline |
| `reasons` | Flip-card deck of reasons |
| `letter` | Sealed letter with paragraphs |
| `cake` | Hold-to-blow candles, wish field |
| `finale` | Closing headline and replay button |

### 3. Photos

Replace the files in `public/media/` with your own images, then point each gallery
item's `src` at the new file (any path under `public/` works, e.g.
`/media/us-at-the-lake.jpg`). Update `alt`, `caption`, `note` and `date` to match.
`shape` controls the masonry span: `portrait`, `landscape`, `wide`, `square` or `tall`.

The 10 shipped SVGs are generated placeholders — delete or ignore them once you add
real photos.

### 4. Music

Drop your own `.mp3`/`.m4a`/`.wav` files into `public/music/` and list them under
`music.tracks`:

```ts
music: {
  enabled: true,
  tracks: [
    { id: 'our-song', title: 'Our Song', artist: 'Artist', src: '/music/our-song.mp3' },
  ],
},
```

Set `enabled: false` to hide the player entirely — the site works fine without audio.
Nothing autoplays; playback only starts if the visitor chooses "Open with sound".

### 5. Colours

`theme.palette` overrides any individual colour from the active preset
(`ink`, `inkSoft`, `text`, `muted`, `accent`, `accentSoft`, `secondary`, `glow`,
`line`). Leave it empty `{}` to use the preset as-is. `theme.grain` sets the film-grain
intensity (0–1).

---

## What is interactive

- **Intro** — loading, invitation, and a "Break the seal" opening sequence (optional sound).
- **Gallery** — click any frame for a full lightbox with keyboard navigation
  (`←` / `→` / `Esc`).
- **Timeline** — scroll-scrubbed line and alternating chapters with a live progress rail.
- **Reasons deck** — draw cards, shuffle the deck, flip for the note; arrow keys work.
- **Letter** — break the wax seal, read paragraphs one at a time, or reveal all; reseal.
- **Cake** — hold the button for 1.6s to blow out the candles (or tap each flame),
  write a wish that is stored only in the browser's `sessionStorage`, then relight.
- **Music player** — expandable pill, play/pause, previous/next, seek, volume, mute.
- **Finale** — "Watch it again" (or press `R`) replays the whole evening.

Accessibility and resilience: full keyboard operation, visible focus states, ARIA
labels, a skip link, `prefers-reduced-motion` support (GSAP timelines and Lenis are
disabled and content renders immediately), and a software-renderer fallback for the
WebGL backdrop.

---

## Deployment

The project is a static Vite build, so it deploys anywhere that serves files.

### Vercel

A `vercel.json` is included (Vite framework preset, SPA rewrites, long-cache headers
for hashed assets). Import the repository at vercel.com, or from the CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

### GitHub Pages / Netlify / any static host

```bash
npm run build
```

Upload the contents of `dist/`. If you host under a sub-path (e.g.
`example.com/birthday/`), set `base: '/birthday/'` in `vite.config.ts` before building.

### GitHub

```bash
git init
git add .
git commit -m "Add birthday experience"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

No GitHub remote is configured in this workspace, so nothing has been pushed.

---

## Project structure

```
src/
  config/
    birthday.ts        # all personal content
    presets.ts         # romantic / bestFriend / closeFriend moods
    types.ts           # config interfaces
  lib/
    theme.ts           # config export, palette -> CSS vars, date helpers
    anim.ts            # GSAP plugin registration
    scroll.ts          # Lenis singleton + scroll helpers
    text.ts, cn.ts
  hooks/
    useAudioEngine.ts  # HTMLAudio-based player state
    useConfetti.ts     # canvas particle bursts
    useActiveSection.ts
    useEnvironment.ts  # reduced motion, pointer, media queries
  components/          # one file per section + shared primitives
  styles/
    global.css         # tokens, typography, buttons, nav, cursor
    sections.css       # layout for every chapter
public/
  media/               # replaceable gallery art
  music/               # replaceable ambient tracks
scripts/
  generate-art.py      # regenerates the placeholder SVGs
  generate-audio.py    # regenerates the placeholder WAV loops
```

The placeholder artwork and audio can be regenerated with:

```bash
python3 scripts/generate-art.py
python3 scripts/generate-audio.py
```

---

## Notes

- The site is entirely client-side; wishes stay in `sessionStorage` on the visitor's
  device and are never sent anywhere.
- Fonts are self-hosted (Bodoni Moda, Instrument Sans, Cormorant Garamond), so there
  are no runtime font CDN requests.
- Designed as a keepsake, not a template — but the config makes it easy to reuse for
  someone else.
