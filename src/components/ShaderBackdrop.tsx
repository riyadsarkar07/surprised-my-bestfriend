import { useEffect, useRef } from 'react'
import type { Palette } from '../config/types'
import { prefersReducedMotion } from '../lib/anim'

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform vec3 uSecondary;
uniform vec3 uGlow;
uniform float uIntensity;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  float t = uTime * 0.035;

  vec2 mouse = (uMouse - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  float mdist = length(p - mouse);
  float mlight = smoothstep(0.85, 0.0, mdist);

  vec2 q = vec2(fbm(p * 1.15 + vec2(0.0, t)), fbm(p * 1.15 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.7 + q * 1.1 + vec2(1.7, 9.2) + t * 0.6),
                fbm(p * 1.7 + q * 1.1 + vec2(8.3, 2.8) - t * 0.45));

  float band1 = smoothstep(0.15, 0.95, fbm(p * 0.9 + r * 0.7 + vec2(t * 0.3, -t * 0.2)) * 0.5 + 0.5);
  float band2 = smoothstep(0.25, 1.0, fbm(p * 1.5 + r * 0.5 + vec2(-t * 0.2, t * 0.4)) * 0.5 + 0.5);

  float aurora = pow(band1, 1.8) * 0.55 + pow(band2, 2.4) * 0.35;

  vec3 col = uInk;
  col = mix(col, uSecondary, aurora * 0.55 * uIntensity);
  col = mix(col, uAccent, pow(band1, 5.0) * 0.5 * uIntensity);
  col = mix(col, uGlow, mlight * 0.16 * uIntensity);

  float horizon = smoothstep(0.62, 0.0, abs(p.y + 0.05));
  col += uAccent * horizon * 0.035 * uIntensity;

  vec2 vg = uv * (1.0 - uv);
  float vignette = pow(vg.x * vg.y * 16.0, 0.36);
  col *= mix(0.42, 1.06, vignette);

  float grain = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const n = Number.parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

interface ShaderBackdropProps {
  palette: Palette
  intensity: number
  targetRef: React.RefObject<HTMLElement | null>
}

export function ShaderBackdrop({ palette, intensity, targetRef }: ShaderBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = prefersReducedMotion()
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })

    if (!gl) {
      canvas.dataset.fallback = 'true'
      return
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? '')
      : ''
    if (/swiftshader|software|llvmpipe|basic render/i.test(renderer)) {
      canvas.dataset.fallback = 'true'
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      canvas.dataset.fallback = 'true'
      return
    }

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.fallback = 'true'
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      res: gl.getUniformLocation(program, 'uRes'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      ink: gl.getUniformLocation(program, 'uInk'),
      accent: gl.getUniformLocation(program, 'uAccent'),
      secondary: gl.getUniformLocation(program, 'uSecondary'),
      glow: gl.getUniformLocation(program, 'uGlow'),
      intensity: gl.getUniformLocation(program, 'uIntensity'),
    }

    gl.uniform3fv(uniforms.ink, hexToRgb(palette.ink))
    gl.uniform3fv(uniforms.accent, hexToRgb(palette.accent))
    gl.uniform3fv(uniforms.secondary, hexToRgb(palette.secondary))
    gl.uniform3fv(uniforms.glow, hexToRgb(palette.glow))
    gl.uniform1f(uniforms.intensity, intensity)

    const resize = () => {
      const quality = window.innerWidth < 768 ? 0.5 : 0.62
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.floor(canvas.clientWidth * dpr * quality)
      const h = Math.floor(canvas.clientHeight * dpr * quality)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = Math.max(1, w)
        canvas.height = Math.max(1, h)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform2f(uniforms.res, canvas.width, canvas.height)
      }
    }

    let visible = true
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onPointer = (event: PointerEvent) => {
      mouseRef.current.tx = event.clientX / window.innerWidth
      mouseRef.current.ty = 1 - event.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    let last = 0
    const start = performance.now()
    const frameInterval = window.innerWidth < 768 ? 1000 / 30 : 0

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      if (!visible) return
      if (frameInterval && now - last < frameInterval) return
      last = now

      const m = mouseRef.current
      m.x += (m.tx - m.x) * 0.045
      m.y += (m.ty - m.y) * 0.045

      const elapsed = reduced ? 8 : (now - start) / 1000
      gl.uniform1f(uniforms.time, elapsed)
      gl.uniform2f(uniforms.mouse, m.x, m.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    if (!reduced) {
      raf = requestAnimationFrame(render)
    } else {
      gl.uniform1f(uniforms.time, 8)
      gl.uniform2f(uniforms.mouse, 0.5, 0.5)
      requestAnimationFrame(() => {
        resize()
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      })
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [palette, intensity])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return
    target.style.setProperty('--accent-rgb', hexToRgb(palette.accent).map((v) => Math.round(v * 255)).join(', '))
  }, [palette, targetRef])

  return (
    <div className="shader-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="shader-canvas" />
      <div className="shader-fallback" />
      <div className="shader-haze" />
    </div>
  )
}
