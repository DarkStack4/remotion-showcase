import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, MONO, clamp, easeInOut, easeOut, rand} from './theme';

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.55'/></svg>\")";

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => (
  <AbsoluteFill
    style={{
      backgroundImage: GRAIN,
      backgroundRepeat: 'repeat',
      opacity,
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.45) 76%, rgba(0,0,0,0.86) 100%)',
      pointerEvents: 'none',
    }}
  />
);

export const Camera: React.FC<{
  children: React.ReactNode;
  zoom?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  x?: number;
  y?: number;
  perspective?: number;
}> = ({children, zoom = 1, rotX = 0, rotY = 0, rotZ = 0, x = 0, y = 0, perspective = 1400}) => (
  <AbsoluteFill style={{perspective}}>
    <AbsoluteFill
      style={{
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${zoom})`,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ------------------------------------------------------------ cuts */

export type Reveal =
  | 'cut'
  | 'iris'
  | 'diamond'
  | 'shutter'
  | 'doors'
  | 'diagonal'
  | 'glitch'
  | 'zoom'
  | 'wave';

export type Exit = 'none' | 'shrink' | 'zoom' | 'left' | 'right' | 'up' | 'fold' | 'fade';

export type FxKind =
  | 'ring'
  | 'spark'
  | 'glitchbars'
  | 'burst'
  | 'scan'
  | 'pixels'
  | 'flash'
  | 'nodes'
  | 'streaks'
  | 'morph'
  | 'digits'
  | 'tiles'
  | 'wave'
  | 'slabs'
  | 'none';

const polygonFrom = (p: number, originX: number, originY: number) => {
  const r = easeOut(p) * 155;
  const pts = [
    [originX, originY - r],
    [originX + r, originY],
    [originX, originY + r],
    [originX - r, originY],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
};

const waveClip = (p: number, f: number) => {
  const base = -32 + easeInOut(p) * 176;
  const pts: string[] = [];
  const n = 42;
  for (let i = n; i >= 0; i--) {
    const x = (i / n) * 100;
    const y =
      base +
      Math.sin(x * 0.21 + f * 0.2) * 6.5 +
      Math.sin(x * 0.07 - f * 0.11) * 3.5;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(0% 0%, 100% 0%, ${pts.join(', ')})`;
};

const clipFor = (reveal: Reveal, p: number, ox: number, oy: number, f: number) => {
  switch (reveal) {
    case 'wave':
      return waveClip(p, f);
    case 'iris':
      return `circle(${easeOut(p) * 135}% at ${ox}% ${oy}%)`;
    case 'diamond':
      return polygonFrom(p, ox, oy);
    case 'shutter':
      return `inset(${(1 - easeInOut(p)) * 50.5}% 0% ${(1 - easeInOut(p)) * 50.5}% 0%)`;
    case 'doors':
      return `inset(0% ${(1 - easeInOut(p)) * 50.5}% 0% ${(1 - easeInOut(p)) * 50.5}%)`;
    case 'diagonal': {
      const q = easeInOut(p) * 210;
      return `polygon(0% 0%, ${q - 10}% 0%, ${q - 110}% 100%, 0% 100%)`;
    }
    default:
      return undefined;
  }
};

const IN = 16;

const ShotInner: React.FC<{
  duration: number;
  reveal: Reveal;
  revealDur: number;
  originX: number;
  originY: number;
  exit: Exit;
  exitDur: number;
  children: React.ReactNode;
}> = ({duration, reveal, revealDur, originX, originY, exit, exitDur, children}) => {
  const f = useCurrentFrame();
  const rp = interpolate(f, [0, Math.max(1, revealDur)], [0, 1], {...clamp, easing: easeInOut});
  const ep = interpolate(f, [duration - Math.max(1, exitDur), duration], [0, 1], {...clamp, easing: easeInOut});

  let x = 0;
  let y = 0;
  let scale = 1;
  let opacity = 1;
  let rotY = 0;
  let jitter = 0;

  if (reveal === 'zoom') {
    const k = 1 - easeOut(Math.min(1, f / Math.max(1, revealDur)));
    scale *= 1 + k * 0.55;
    opacity *= Math.min(1, f / 7);
  }
  if (reveal === 'glitch') {
    const r = rand(31);
    jitter = f < 11 ? (r() - 0.5) * 90 * (1 - f / 11) : 0;
    opacity *= Math.min(1, f / 4);
  }

  switch (exit) {
    case 'shrink':
      scale *= 1 - easeInOut(ep) * 0.97;
      opacity *= 1 - easeInOut(ep);
      break;
    case 'zoom':
      scale *= 1 + ep * 1.8;
      opacity *= 1 - ep;
      break;
    case 'left':
      x -= ep * 70;
      scale *= 1 + ep * 0.08;
      opacity *= 1 - ep * 0.9;
      break;
    case 'right':
      x += ep * 70;
      scale *= 1 + ep * 0.08;
      opacity *= 1 - ep * 0.9;
      break;
    case 'up':
      y -= ep * 70;
      scale *= 1 + ep * 0.08;
      opacity *= 1 - ep * 0.9;
      break;
    case 'fold':
      rotY = ep * 92;
      opacity *= 1 - ep;
      break;
    case 'fade':
      opacity *= 1 - ep;
      break;
    case 'none':
      break;
  }

  const clip = clipFor(reveal, rp, originX, originY, f);

  return (
    <AbsoluteFill
      style={{
        opacity,
        clipPath: clip,
        WebkitClipPath: clip,
        transform: `perspective(1500px) translate3d(${x + jitter}%, ${y}%, 0) rotateY(${rotY}deg) scale(${scale})`,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity, clip-path',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Shot: React.FC<{
  from: number;
  duration: number;
  reveal?: Reveal;
  revealDur?: number;
  originX?: number;
  originY?: number;
  exit?: Exit;
  exitDur?: number;
  children: React.ReactNode;
}> = ({
  from,
  duration,
  reveal = 'iris',
  revealDur = 22,
  originX = 50,
  originY = 50,
  exit = 'shrink',
  exitDur = 22,
  children,
}) => (
  <Sequence from={from} durationInFrames={duration} layout="none">
    <ShotInner
      duration={duration}
      reveal={reveal}
      revealDur={revealDur}
      originX={originX}
      originY={originY}
      exit={exit}
      exitDur={exitDur}
    >
      {children}
    </ShotInner>
  </Sequence>
);

/* ------------------------------------------------------------ bridge fx */

export const CutFx: React.FC<{kind: FxKind; duration: number; originX?: number; originY?: number}> = ({
  kind,
  duration,
  originX = 50,
  originY = 50,
}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / Math.max(1, duration));
  const q = easeOut(p);

  if (kind === 'none') return null;

  if (kind === 'ring') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {[0, 1, 2].map((i) => {
          const d = Math.max(0, Math.min(1, (f - i * 3) / Math.max(1, duration - 6)));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${originX}%`,
                top: `${originY}%`,
                width: 420,
                height: 420,
                marginLeft: -210,
                marginTop: -210,
                borderRadius: '50%',
                border: `2px solid ${i === 1 ? C.violet : C.cyan}`,
                transform: `scale(${easeOut(d) * 4})`,
                opacity: (1 - d) * 0.8,
                boxShadow: `0 0 40px ${C.cyan}44`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'spark') {
    const r = rand(91);
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {Array.from({length: 34}).map((_, i) => {
          const a = (i / 34) * Math.PI * 2 + r() * 0.4;
          const dist = easeOut(p) * (420 + r() * 620);
          const s = 3 + r() * 5;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${originX}%`,
                top: `${originY}%`,
                width: s,
                height: s,
                borderRadius: '50%',
                background: i % 3 === 0 ? C.pink : i % 2 === 0 ? C.cyan : C.ink,
                transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px)`,
                opacity: (1 - p) * 0.95,
                boxShadow: `0 0 12px ${C.cyan}`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'glitchbars') {
    const r = rand(53);
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        {Array.from({length: 18}).map((_, i) => {
          const y = r() * 100;
          const h = 2 + r() * 34;
          const dx = (r() - 0.5) * 220 * (1 - p);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${y}%`,
                height: h,
                transform: `translateX(${dx}px)`,
                background: i % 4 === 0 ? C.cyan : i % 4 === 1 ? C.pink : i % 4 === 2 ? C.ink : C.violet,
                opacity: (1 - p) * (0.12 + r() * 0.3),
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'scan') {
    const y = p * 112;
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y}%`,
            height: 180,
            transform: 'translateY(-50%)',
            background: `linear-gradient(180deg, transparent, ${C.cyan}33, transparent)`,
            opacity: Math.sin(Math.PI * p),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y}%`,
            height: 2,
            background: C.cyan,
            boxShadow: `0 0 24px ${C.cyan}`,
            opacity: Math.sin(Math.PI * p),
          }}
        />
      </AbsoluteFill>
    );
  }

  if (kind === 'burst') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        {Array.from({length: 44}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 3,
              height: 1400,
              marginLeft: -1.5,
              marginTop: -700,
              background: `linear-gradient(180deg, transparent, ${i % 3 === 0 ? C.pink : C.cyan}, transparent)`,
              transform: `rotate(${(i / 44) * 360}deg) scaleY(${0.1 + q * 0.9})`,
              opacity: (1 - p) * 0.35,
              transformOrigin: '50% 50%',
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }

  if (kind === 'pixels') {
    const r = rand(17);
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {Array.from({length: 80}).map((_, i) => {
          const a = r() * Math.PI * 2;
          const dist = q * (240 + r() * 760);
          const s = 6 + r() * 22;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${Math.cos(a) * dist}px)`,
                top: `calc(50% + ${Math.sin(a) * dist}px)`,
                width: s,
                height: s,
                background: i % 4 === 0 ? C.violet : i % 3 === 0 ? C.pink : C.cyan,
                opacity: (1 - p) * 0.7,
                transform: `rotate(${q * 220 + i}deg)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'nodes') {
    const pts = Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + p * 0.6;
      const r = 70 + q * 560;
      return {cx: 960 + Math.cos(a) * r, cy: 540 + Math.sin(a) * r * 0.86};
    });
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
          {pts.map((pt, i) => {
            const next = pts[(i + 1) % pts.length];
            return (
              <line
                key={i}
                x1={pt.cx}
                y1={pt.cy}
                x2={next.cx}
                y2={next.cy}
                stroke={C.cyan}
                strokeWidth={1.2}
                opacity={(1 - p) * 0.45}
              />
            );
          })}
          {pts.map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r={3.5 + (i % 3)} fill={i % 4 === 0 ? C.pink : C.cyan} opacity={(1 - p) * 0.9} />
          ))}
        </svg>
      </AbsoluteFill>
    );
  }

  if (kind === 'streaks') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        {Array.from({length: 56}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 2,
              height: 1250,
              marginLeft: -1,
              marginTop: -625,
              background: `linear-gradient(180deg, transparent, ${i % 3 === 0 ? C.pink : C.cyan}, transparent)`,
              transform: `rotate(${(i / 56) * 360}deg) scaleY(${0.05 + q * 1.2})`,
              opacity: (1 - p) * 0.4,
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }

  if (kind === 'morph') {
    const hex = (r: number, rot: number) =>
      Array.from({length: 6}, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + (rot * Math.PI) / 180;
        return `${960 + Math.cos(a) * r},${540 + Math.sin(a) * r}`;
      }).join(' ');
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
          {[0, 1, 2].map((i) => (
            <polygon
              key={i}
              points={hex(120 + q * (420 + i * 120), f * (1.6 + i * 0.5) + i * 30)}
              fill="none"
              stroke={i === 1 ? C.violet : i === 2 ? C.pink : C.cyan}
              strokeWidth={2}
              opacity={(1 - p) * 0.7}
            />
          ))}
        </svg>
      </AbsoluteFill>
    );
  }

  if (kind === 'digits') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        {Array.from({length: 52}).map((_, i) => {
          const x = (i * 149) % 1900;
          const y = ((i * 271 + f * 46) % 1320) - 120;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontFamily: MONO,
                fontSize: 18 + (i % 4) * 5,
                color: i % 5 === 0 ? C.cyan : 'rgba(200,225,255,0.75)',
                opacity: (1 - p) * 0.55,
              }}
            >
              {String((i * 97 + f * 13) % 10)}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'tiles') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {Array.from({length: 28}).map((_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          const tx = 130 + col * 240 - 960;
          const ty = 230 + row * 146 - 540;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${tx * q}px)`,
                top: `calc(50% + ${ty * q}px)`,
                width: 190,
                height: 112,
                marginLeft: -95,
                marginTop: -56,
                border: `1px solid ${i % 3 === 0 ? C.cyan : 'rgba(238,244,255,0.35)'}`,
                background: 'rgba(8,14,28,0.55)',
                opacity: (1 - p) * 0.6,
                transform: `scale(${0.4 + q * 0.6})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'wave') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
          {[0, 1, 2, 3].map((k) => {
            const d = Array.from({length: 64}, (_, i) => {
              const x = (i / 63) * 1920;
              const y =
                420 +
                k * 90 +
                Math.sin(x * 0.0055 + f * 0.14 + k) * (50 + k * 8) +
                Math.sin(x * 0.0021 - f * 0.07) * 34;
              return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            return (
              <path
                key={k}
                d={d}
                fill="none"
                stroke={k % 2 === 0 ? C.cyan : C.violet}
                strokeWidth={1.6}
                opacity={(1 - p) * 0.55}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  }

  if (kind === 'slabs') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {Array.from({length: 7}).map((_, i) => {
          const pi = Math.max(0, Math.min(1, (p - i * 0.012) / 0.93));
          const off = Math.sin(Math.PI * pi);
          const dir = i % 2 === 0 ? -1 : 1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -40,
                width: 'calc(100% + 80px)',
                top: `${(i / 7) * 100}%`,
                height: '14.6%',
                background: '#05070f',
                borderTop: `1px solid ${i % 2 === 0 ? C.cyan : C.violet}`,
                transform: `translateY(${dir * (1 - off) * 130}%)`,
                opacity: off > 0.02 ? 1 : 0,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (kind === 'flash') {
    const o = interpolate(f, [0, 4, duration], [0, 0.95, 0], clamp);
    return <AbsoluteFill style={{background: C.ink, opacity: o, pointerEvents: 'none'}} />;
  }

  return null;
};

/* ------------------------------------------------------------ hud */

export const Label: React.FC<{
  index: string;
  text: string;
  style?: React.CSSProperties;
}> = ({index, text, style}) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: MONO,
      fontSize: 17,
      letterSpacing: 5,
      color: C.dim,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    <span style={{color: C.cyan}}>{index}</span>
    <span style={{width: 42, height: 1, background: C.faint}} />
    <span>{text}</span>
  </div>
);

export const Corners: React.FC<{size?: number; inset?: number; color?: string}> = ({
  size = 34,
  inset = 54,
  color = 'rgba(238,244,255,0.35)',
}) => {
  const base: React.CSSProperties = {position: 'absolute', width: size, height: size, borderColor: color, borderStyle: 'solid', borderWidth: 0};
  return (
    <>
      <div style={{...base, top: inset, left: inset, borderTopWidth: 1, borderLeftWidth: 1}} />
      <div style={{...base, top: inset, right: inset, borderTopWidth: 1, borderRightWidth: 1}} />
      <div style={{...base, bottom: inset, left: inset, borderBottomWidth: 1, borderLeftWidth: 1}} />
      <div style={{...base, bottom: inset, right: inset, borderBottomWidth: 1, borderRightWidth: 1}} />
    </>
  );
};

const pad = (n: number) => String(n).padStart(2, '0');

export const HUD: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const p = Math.min(1, frame / durationInFrames);
  const secs = Math.floor(frame / fps);
  const ff = frame % fps;
  const tc = `00:${pad(secs)}:${pad(ff)}`;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 54,
          left: 62,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 5,
          color: 'rgba(238,244,255,0.5)',
        }}
      >
        KINETIC<span style={{color: C.cyan}}> / </span>60S
      </div>
      <div
        style={{
          position: 'absolute',
          top: 54,
          right: 62,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 5,
          color: 'rgba(238,244,255,0.5)',
        }}
      >
        {tc}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2, background: 'rgba(255,255,255,0.08)'}}>
        <div
          style={{
            width: `${p * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${C.blue}, ${C.cyan}, ${C.pink})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const GridDots: React.FC<{gap?: number; size?: number; opacity?: number; color?: string}> = ({
  gap = 64,
  size = 2,
  opacity = 0.22,
  color = 'rgba(140,190,255,1)',
}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(circle, ${color} ${size}px, transparent ${size}px)`,
      backgroundSize: `${gap}px ${gap}px`,
      opacity,
    }}
  />
);
