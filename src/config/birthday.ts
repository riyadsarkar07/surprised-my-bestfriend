import type { BirthdayConfig } from './types'
import { relationshipPresets } from './presets'

export const birthdayConfig: BirthdayConfig = {
  recipient: {
    name: 'Aria',
    relationship: 'romantic',
    birthday: '1998-08-14',
    age: 27,
    pronoun: 'her',
  },

  theme: {
    palette: {},
    grain: 0.055,
  },

  hero: {
    eyebrow: 'A private screening · One guest of honour',
    headline: 'A year of you',
    subline:
      'A small cinematic corner of the internet, built to celebrate the person who makes ordinary days feel like they were written by hand.',
    kicker: 'Happy birthday, {name}',
    primaryCta: 'Begin the evening',
    secondaryCta: 'Open the letter',
    scrollCue: 'Scroll to enter',
    sideNote: 'Chapter one of seven',
  },

  celebration: {
    eyebrow: 'Chapter one',
    title: 'The world got a little brighter on this day.',
    lead: 'Not a countdown. Not a checklist. Just a long, warm look at everything you are.',
    body:
      'Every year adds a new scene to the film of you — new laughter, new courage, new small kindnesses nobody else notices. This page exists to hold a few of them still for a moment.',
    confettiCta: 'Throw some light',
    dateLabel: 'The day it all began',
    stats: {
      age: 'Years on earth',
      days: 'Days of being you',
      reasons: 'Reasons written here',
      candles: 'Candles to blow out',
    },
  },

  memories: {
    eyebrow: 'Chapter two',
    title: 'Frames worth keeping',
    intro:
      'A gallery of moments, gathered like photographs on a bedside table. Replace each frame with your own memories — the small ones count most.',
    items: [
      {
        id: 'memory-01',
        src: '/media/memory-01.svg',
        alt: 'Abstract warm-toned artwork standing in for a personal photograph',
        caption: 'The first frame',
        note: 'Replace this with the story behind the photo — where you were, what was said, why it stayed.',
        date: 'PLACEHOLDER DATE',
        shape: 'portrait',
      },
      {
        id: 'memory-02',
        src: '/media/memory-02.svg',
        alt: 'Abstract blue-toned artwork standing in for a personal photograph',
        caption: 'A golden hour',
        note: 'A caption can be one line. The memory behind it can be endless.',
        date: 'PLACEHOLDER DATE',
        shape: 'landscape',
      },
      {
        id: 'memory-03',
        src: '/media/memory-03.svg',
        alt: 'Abstract blush artwork standing in for a personal photograph',
        caption: 'The unplanned day',
        note: 'The best days are rarely the ones in the calendar.',
        date: 'PLACEHOLDER DATE',
        shape: 'square',
      },
      {
        id: 'memory-04',
        src: '/media/memory-04.svg',
        alt: 'Abstract deep violet artwork standing in for a personal photograph',
        caption: 'Somewhere quiet',
        note: 'Write the thing only the two of you would understand.',
        date: 'PLACEHOLDER DATE',
        shape: 'tall',
      },
      {
        id: 'memory-05',
        src: '/media/memory-05.svg',
        alt: 'Abstract amber artwork standing in for a personal photograph',
        caption: 'Laughing, probably',
        note: 'A photo that still makes you smile before you even look at it.',
        date: 'PLACEHOLDER DATE',
        shape: 'wide',
      },
      {
        id: 'memory-06',
        src: '/media/memory-06.svg',
        alt: 'Abstract rose artwork standing in for a personal photograph',
        caption: 'The in-between',
        note: 'Not every memory needs a milestone attached.',
        date: 'PLACEHOLDER DATE',
        shape: 'portrait',
      },
      {
        id: 'memory-07',
        src: '/media/memory-07.svg',
        alt: 'Abstract sepia artwork standing in for a personal photograph',
        caption: 'A whole era',
        note: 'Replace with a photo that feels like a chapter, not a moment.',
        date: 'PLACEHOLDER DATE',
        shape: 'landscape',
      },
      {
        id: 'memory-08',
        src: '/media/memory-08.svg',
        alt: 'Abstract ember artwork standing in for a personal photograph',
        caption: 'Late and loud',
        note: 'For the stories that get better every time they are told.',
        date: 'PLACEHOLDER DATE',
        shape: 'portrait',
      },
      {
        id: 'memory-09',
        src: '/media/memory-09.svg',
        alt: 'Abstract indigo artwork standing in for a personal photograph',
        caption: 'Somewhere we belong',
        note: 'Places become memories because of who was there.',
        date: 'PLACEHOLDER DATE',
        shape: 'landscape',
      },
      {
        id: 'memory-10',
        src: '/media/memory-10.svg',
        alt: 'Abstract mauve artwork standing in for a personal photograph',
        caption: 'To be continued',
        note: 'The next photo has not been taken yet.',
        date: 'PLACEHOLDER DATE',
        shape: 'tall',
      },
    ],
  },

  story: {
    eyebrow: 'Chapter three',
    title: 'How we got here',
    intro:
      'A timeline is a strange thing: it looks like a straight line, but it feels like a spiral. Here are the turns that mattered.',
    quote: 'Some people arrive in your life and quietly rearrange the furniture.',
    events: [
      {
        id: 'story-01',
        year: 'YEAR',
        chapter: 'The beginning',
        title: 'The day we met',
        description:
          'Replace this with the true beginning — the place, the weather, the first thing they said. Keep it small and specific.',
        tag: 'First page',
      },
      {
        id: 'story-02',
        year: 'YEAR',
        chapter: 'The middle',
        title: 'The night that changed everything',
        description:
          'Every friendship and every love story has a hinge. Describe yours here, in your own words.',
        tag: 'Turning point',
        image: '/media/memory-05.svg',
      },
      {
        id: 'story-03',
        year: 'YEAR',
        chapter: 'The detour',
        title: 'A season apart',
        description:
          'The distance, the misunderstanding, the busy year — whatever it was, it made the return sweeter.',
        tag: 'The test',
      },
      {
        id: 'story-04',
        year: 'YEAR',
        chapter: 'The return',
        title: 'Finding our way back',
        description:
          'A placeholder for the reunion, the reconciliation, the moment it became obvious this was permanent.',
        tag: 'Homecoming',
      },
      {
        id: 'story-05',
        year: 'TODAY',
        chapter: 'Now',
        title: 'Still here, still choosing this',
        description:
          'The most romantic line in any story: we are still writing it. Add the present chapter here.',
        tag: 'To be continued',
        image: '/media/memory-09.svg',
      },
    ],
  },

  reasons: {
    eyebrow: 'Chapter four',
    title: 'A deck of reasons',
    intro:
      'Not a list — a small game. Draw a card, hold it for a second, then let it go. There are more where these came from.',
    items: [
      {
        id: 'reason-01',
        tag: 'The way you listen',
        title: 'You make people feel heard.',
        body: 'You ask the second question. The one most people skip. That habit has changed more lives than you know.',
      },
      {
        id: 'reason-02',
        tag: 'The way you laugh',
        title: 'Your laugh is a room I want to live in.',
        body: 'It arrives before the joke lands, and it makes everyone nearby braver about being happy.',
      },
      {
        id: 'reason-03',
        tag: 'The way you try',
        title: 'You keep showing up.',
        body: 'On the hard days, when no one would blame you for disappearing, you show up anyway. That is a rare kind of courage.',
      },
      {
        id: 'reason-04',
        tag: 'The way you notice',
        title: 'You remember the tiny details.',
        body: 'The coffee order, the song, the thing someone mentioned once. You collect people gently.',
      },
      {
        id: 'reason-05',
        tag: 'The way you love',
        title: 'You love without keeping score.',
        body: 'Generosity like yours is not naive. It is a decision, made again and again. I see it every time.',
      },
      {
        id: 'reason-06',
        tag: 'The way you grow',
        title: 'You are always becoming.',
        body: 'You never let a version of yourself be the final one. Watching that happen is the best show there is.',
      },
      {
        id: 'reason-07',
        tag: 'The way you rest',
        title: 'You make ordinary afternoons feel holy.',
        body: 'The quiet hours count too. Some of my favourite memories of you are ones where nothing at all happened.',
      },
    ],
  },

  letter: {
    eyebrow: 'Chapter five',
    title: 'A letter, sealed for you',
    intro: 'Written to be read slowly. There is no timer on this page.',
    sealLabel: 'Break the seal',
    salutation: 'My dearest {name},',
    paragraphs: [
      'I have started this letter more times than I can count, and every version began the same way: with the impossible task of fitting you into a paragraph.',
      'So instead of describing you, let me describe what it is like to know you. It is like finding a window in a room you thought had no windows. Suddenly there is light, and air, and the sound of something happening outside.',
      'You have a way of making the world feel more possible. Not because you fix it, but because you look at it honestly and still choose to be kind. That is the whole trick, I think. And you do it without even noticing.',
      'This year, I hope you take up more space. I hope you say no without apologising. I hope you are loved out loud, in the specific way you deserve. I hope you get to be the main character of your own life for a while.',
      'And if you ever forget how much you matter, come back to this page. I will have written it all down for you.',
    ],
    closing: 'Happy birthday, my favourite person.',
    signature: 'With everything I have,',
    postscript: 'P.S. The candles are real. Make a wish.',
    revealAll: 'Reveal the whole letter',
    reseal: 'Seal it again',
  },

  cake: {
    eyebrow: 'Chapter six',
    title: 'Make a wish',
    intro:
      'The cake is lit. Hold the button to blow out the candles — or tap each flame if you prefer to take your time.',
    holdCta: 'Hold to blow out the candles',
    holdingCta: 'Keep holding…',
    candleHint: 'Or tap a flame',
    wishLabel: 'What did you wish for?',
    wishPlaceholder: 'Write it here, or keep it secret.',
    wishSealed: 'Your wish is safe with the page. It stays in this browser and nowhere else.',
    relight: 'Light them again',
    candles: 5,
  },

  finale: {
    eyebrow: 'Final chapter',
    title: 'Here is to the next scene.',
    message:
      'No matter how many birthdays we get to share, I will always be the person in the front row, cheering the loudest.',
    signature: 'Happy birthday, {name}.',
    replayCta: 'Watch it again',
    replayHint: 'Or press R to replay the whole evening.',
  },

  music: {
    enabled: true,
    tracks: [
      {
        id: 'velvet-hours',
        title: 'Velvet Hours',
        artist: 'Ambient score · replaceable',
        src: '/music/velvet-hours.wav',
      },
      {
        id: 'paper-lanterns',
        title: 'Paper Lanterns',
        artist: 'Ambient score · replaceable',
        src: '/music/paper-lanterns.wav',
      },
    ],
  },
}

export const preset = relationshipPresets[birthdayConfig.recipient.relationship]
