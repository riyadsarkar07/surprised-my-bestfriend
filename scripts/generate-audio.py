#!/usr/bin/env python3
"""Generates two soft, original ambient loops for the birthday site.

No samples, no third-party audio: just additive sine synthesis rendered to
16-bit mono WAV. Replace the files in public/music/ with your own songs.
"""
from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path

SR = 22050
DURATION = 32.0
OUT = Path(__file__).resolve().parent.parent / "public" / "music"
OUT.mkdir(parents=True, exist_ok=True)


def envelope(t: float, duration: float, fade: float = 3.5) -> float:
    fade_in = min(1.0, t / fade)
    fade_out = min(1.0, (duration - t) / fade)
    return max(0.0, min(fade_in, fade_out)) ** 1.6


def make_track(name: str, root: float, chord: list[float], seed: int) -> None:
    rng = random.Random(seed)
    n = int(SR * DURATION)
    samples: list[float] = []
    drift = [rng.uniform(0, math.tau) for _ in range(8)]

    for i in range(n):
        t = i / SR
        value = 0.0

        for idx, ratio in enumerate(chord):
            freq = root * ratio
            detune = 1.0 + 0.0018 * math.sin(math.tau * (0.035 + idx * 0.006) * t + drift[idx])
            phase = math.tau * freq * detune * t
            slow = 0.62 + 0.38 * math.sin(math.tau * (0.021 + idx * 0.004) * t + drift[idx + 1])
            value += math.sin(phase) * 0.16 * slow
            value += math.sin(phase * 2.0) * 0.035 * slow
            value += math.sin(phase * 3.0) * 0.012 * slow

        shimmer = math.sin(math.tau * root * 4.0 * t) * 0.012
        shimmer *= 0.5 + 0.5 * math.sin(math.tau * 0.07 * t)
        value += shimmer

        breath = 0.5 + 0.5 * math.sin(math.tau * 0.013 * t + drift[5])
        value *= 0.5 + 0.5 * breath
        value *= envelope(t, DURATION)

        # gentle low-pass via leaky integrator for a warm top end
        value = value * 0.86

        samples.append(max(-1.0, min(1.0, value)))

    # one-pole low-pass smoothing
    smoothed: list[float] = []
    prev = 0.0
    for s in samples:
        prev = prev + 0.22 * (s - prev)
        smoothed.append(prev)

    path = OUT / f"{name}.wav"
    with wave.open(str(path), "wb") as fh:
        fh.setnchannels(1)
        fh.setsampwidth(2)
        fh.setframerate(SR)
        frames = bytearray()
        for s in smoothed:
            frames += struct.pack("<h", int(max(-1.0, min(1.0, s * 1.25)) * 32767))
        fh.writeframes(bytes(frames))
    size_mb = path.stat().st_size / (1024 * 1024)
    print(f"{path.name}: {size_mb:.2f} MB")


def main() -> None:
    make_track("velvet-hours", 110.0, [1.0, 1.5, 2.0, 2.25, 3.0], 11)
    make_track("paper-lanterns", 98.0, [1.0, 1.3333, 1.5, 2.0, 2.6667], 29)


if __name__ == "__main__":
    main()
