/**
 * Lightweight paper-and-wash atmosphere.
 * Replaces the WebGL aurora: three soft floral colour washes, a paper
 * grain layer and a paper vignette. Pure CSS, no GPU cost, no fallback path.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <span className="atmosphere__wash atmosphere__wash--a" />
      <span className="atmosphere__wash atmosphere__wash--b" />
      <span className="atmosphere__wash atmosphere__wash--c" />
    </div>
  )
}

/** A small botanical sprig used as a section ornament. */
export function Botanical({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`botanical${className ? ` ${className}` : ''}`}
      viewBox="0 0 120 180"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M60 176 C 58 132, 62 92, 60 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      {[0, 1, 2, 3].map((i) => {
        const y = 52 + i * 30
        return (
          <g key={i}>
            <path
              d={`M60 ${y} C ${40 - i * 2} ${y - 12}, ${26 - i * 2} ${y - 4}, ${22 - i * 2} ${y + 12} C ${38 - i} ${y + 16}, ${54} ${y + 8}, 60 ${y}`}
              fill="currentColor"
              opacity={0.3 - i * 0.04}
            />
            <path
              d={`M60 ${y + 6} C ${80 + i * 2} ${y - 6}, ${94 + i * 2} ${y + 2}, ${98 + i * 2} ${y + 18} C ${82 + i} ${y + 22}, ${66} ${y + 14}, 60 ${y + 6}`}
              fill="currentColor"
              opacity={0.24 - i * 0.035}
            />
          </g>
        )
      })}
      <circle cx="60" cy="18" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="18" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    </svg>
  )
}
