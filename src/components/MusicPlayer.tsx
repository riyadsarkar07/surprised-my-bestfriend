import { useState } from 'react'
import { ListMusic, Volume1, Volume2, VolumeX } from 'lucide-react'
import type { AudioEngine } from '../hooks/useAudioEngine'
import { config } from '../lib/theme'

interface MusicPlayerProps {
  audio: AudioEngine
  visible: boolean
}

function formatTime(value: number): string {
  if (!Number.isFinite(value)) return '0:00'
  const mins = Math.floor(value / 60)
  const secs = Math.floor(value % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function MusicPlayer({ audio, visible }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  if (!visible || !config.music.enabled || !config.music.tracks.length) return null

  const VolumeIcon = audio.muted || audio.volume === 0 ? VolumeX : audio.volume > 0.55 ? Volume2 : Volume1

  return (
    <div className={`player${expanded ? ' is-expanded' : ''}`} aria-label="Soundtrack player">
      <button
        type="button"
        className="player__toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="player-panel"
      >
        <span className={`player__eq${audio.playing ? ' is-playing' : ''}`} aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        <span className="player__now">
          <span className="player__state">{audio.playing ? 'Now playing' : 'Soundtrack'}</span>
          <span className="player__title">{audio.track?.title ?? 'No track selected'}</span>
        </span>
      </button>

      <div className="player__panel" id="player-panel">
        <div className="player__controls">
          <button type="button" className="player__btn" onClick={() => audio.previous()} aria-label="Previous track">
            <span aria-hidden="true">«</span>
          </button>
          <button
            type="button"
            className="player__play"
            onClick={() => void audio.toggle()}
            aria-label={audio.playing ? 'Pause' : 'Play'}
          >
            {audio.playing ? (
              <span className="player__pause" aria-hidden="true"><span /><span /></span>
            ) : (
              <span className="player__triangle" aria-hidden="true" />
            )}
          </button>
          <button type="button" className="player__btn" onClick={() => audio.next()} aria-label="Next track">
            <span aria-hidden="true">»</span>
          </button>
        </div>

        <div className="player__scrub">
          <input
            type="range"
            min={0}
            max={audio.duration || 0}
            step={0.1}
            value={audio.progress}
            onChange={(event) => audio.seek(Number(event.target.value))}
            aria-label="Track progress"
            style={{ ['--value' as string]: `${audio.duration ? (audio.progress / audio.duration) * 100 : 0}%` }}
          />
          <div className="player__time">
            <span>{formatTime(audio.progress)}</span>
            <span>{formatTime(audio.duration)}</span>
          </div>
        </div>

        <div className="player__volume">
          <button type="button" onClick={audio.toggleMute} aria-label={audio.muted ? 'Unmute' : 'Mute'}>
            <VolumeIcon size={15} strokeWidth={1.6} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audio.muted ? 0 : audio.volume}
            onChange={(event) => audio.setVolume(Number(event.target.value))}
            aria-label="Volume"
            style={{ ['--value' as string]: `${(audio.muted ? 0 : audio.volume) * 100}%` }}
          />
        </div>

        <button
          type="button"
          className="player__list-toggle"
          onClick={() => setListOpen((prev) => !prev)}
          aria-expanded={listOpen}
          aria-label="Track list"
        >
          <ListMusic size={15} strokeWidth={1.6} />
        </button>
      </div>

      {listOpen ? (
        <ul className="player__list">
          {config.music.tracks.map((track, index) => (
            <li key={track.id}>
              <button
                type="button"
                className={index === audio.trackIndex ? 'is-active' : ''}
                onClick={() => {
                  if (index === audio.trackIndex) {
                    void audio.toggle()
                  } else {
                    audio.pause()
                    for (let i = 0; i < Math.abs(index - audio.trackIndex); i++) {
                      if (index > audio.trackIndex) audio.next()
                      else audio.previous()
                    }
                    void audio.play()
                  }
                }}
              >
                <span className="player__list-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="player__list-meta">
                  <span>{track.title}</span>
                  <small>{track.artist}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {audio.playing ? `Playing ${audio.track?.title}` : 'Soundtrack paused'}
      </p>
    </div>
  )
}
