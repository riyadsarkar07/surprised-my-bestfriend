import { useCallback, useEffect, useRef, useState } from 'react'
import type { MusicTrack } from '../config/types'

interface UseAudioEngineOptions {
  tracks: MusicTrack[]
  enabled: boolean
}

export interface AudioEngine {
  ready: boolean
  playing: boolean
  muted: boolean
  volume: number
  trackIndex: number
  track: MusicTrack | null
  progress: number
  duration: number
  toggle: () => Promise<void>
  play: () => Promise<void>
  pause: () => void
  next: () => void
  previous: () => void
  seek: (value: number) => void
  setVolume: (value: number) => void
  toggleMute: () => void
  unlock: () => Promise<void>
}

export function useAudioEngine({ tracks, enabled }: UseAudioEngineOptions): AudioEngine {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(0.55)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const track = tracks[trackIndex] ?? null

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.loop = false
    audio.volume = volume
    audioRef.current = audio

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      setReady(true)
    }
    const onTime = () => {
      setProgress(audio.currentTime)
    }
    const onEnded = () => {
      setTrackIndex((prev) => (tracks.length ? (prev + 1) % tracks.length : 0))
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setReady(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    const wasPlaying = !audio.paused
    audio.src = track.src
    audio.load()
    setProgress(0)
    setDuration(0)
    if (wasPlaying) {
      void audio.play().catch(() => setPlaying(false))
    }
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      await audio.play()
    } catch {
      setPlaying(false)
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      await play()
    } else {
      pause()
    }
  }, [pause, play])

  const next = useCallback(() => {
    if (!tracks.length) return
    setTrackIndex((prev) => (prev + 1) % tracks.length)
  }, [tracks.length])

  const previous = useCallback(() => {
    if (!tracks.length) return
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  const seek = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setProgress(value)
  }, [])

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)))
    if (value > 0) setMuted(false)
  }, [])

  const toggleMute = useCallback(() => setMuted((prev) => !prev), [])
  const unlock = useCallback(async () => {
    await play()
  }, [play])

  return {
    ready,
    playing,
    muted,
    volume,
    trackIndex,
    track,
    progress,
    duration,
    toggle,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    unlock,
  }
}
