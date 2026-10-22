import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, MONO, clamp, easeInOut, easeOut, lerp, rand} from './theme';
import {Camera, Corners, GridDots, Label} from './ui';

const center: React.CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
};

/* ------------------------------------------------------------------ 01 */

export const Open: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 110], [1.14, 1], clamp);
  const line = interpolate(f, [14, 74], [0, 620], {...clamp, easing: easeOut});
  const sub = interpolate(f, [52, 84], [0, 1], clamp);
  const letters = 'KINETIC'.split('');

  return (
    <AbsoluteFill>
      <Camera zoom={zoom}>
        <GridDots gap={76} opacity={0.1} />
        <AbsoluteFill style={center}>
          <div style={{display: 'flex'}}>
            {letters.map((l, i) => {
              const p = interpolate(f, [6 + i * 3, 26 + i * 3], [0, 1], {...clamp, easing: easeOut});
              return (
                <div key={i} style={{overflow: 'hidden', height: 268}}>
                  <div
                    style={{
                      transform: `translateY(${(1 - p) * 100}%)`,
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 232,
                      lineHeight: '268px',
                      letterSpacing: -8,
                      color: C.ink,
                    }}
                  >
                    {l}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{width: line, height: 1, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`}} />
          <div
            style={{
              marginTop: 26,
              fontFamily: MONO,
              fontSize: 18,
              letterSpacing: 11,
              color: C.dim,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            MOTION STUDY / 60 SECONDS
          </div>
        </AbsoluteFill>
      </Camera>
      <Label index="01" text="Ignition" style={{bottom: 96, left: 62}} />
      <Corners />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 02 */

const NODES = (() => {
  const r = rand(77);
  return Array.from({length: 22}, () => ({x: 0.08 + r() * 0.84, y: 0.12 + r() * 0.76, s: 0.5 + r() * 0.8}));
})();

const EDGES = NODES.flatMap((_, i) => [
  {a: i, b: (i + 1) % NODES.length},
  {a: i, b: (i + 3) % NODES.length},
  {a: i, b: (i + 8) % NODES.length},
]);

export const Network: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 190], [1.16, 1], clamp);
  const rotY = interpolate(f, [0, 190], [-9, 7], clamp);
  const rotX = interpolate(f, [0, 190], [5, -3], clamp);
  const rows = ['SIGNAL', 'SYSTEM', 'SCALE'];

  return (
    <AbsoluteFill>
      <Camera zoom={zoom} rotY={rotY} rotX={rotX}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(48,90,190,0.16), transparent 62%)'}} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="0.85" />
              <stop offset="100%" stopColor={C.violet} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {EDGES.map((e, i) => {
            const a = NODES[e.a];
            const b = NODES[e.b];
            const p = interpolate(f, [10 + (i % 22) * 2, 34 + (i % 22) * 2], [0, 1], clamp);
            return (
              <line
                key={i}
                x1={a.x * 1920}
                y1={a.y * 1080}
                x2={lerp(a.x, b.x, easeOut(p)) * 1920}
                y2={lerp(a.y, b.y, easeOut(p)) * 1080}
                stroke="url(#edge)"
                strokeWidth={1.2}
              />
            );
          })}
          {NODES.map((n, i) => {
            const p = interpolate(f, [4 + i * 2, 22 + i * 2], [0, 1], clamp);
            const s = 3 + n.s * 4;
            return (
              <g key={i} opacity={p}>
                <circle cx={n.x * 1920} cy={n.y * 1080} r={s * 4.5} fill={C.cyan} opacity={0.08} />
                <circle cx={n.x * 1920} cy={n.y * 1080} r={s} fill={i % 6 === 0 ? C.pink : C.ink} opacity={0.9} />
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left: 118, bottom: 118}}>
          {rows.map((r, i) => {
            const p = interpolate(f, [46 + i * 7, 74 + i * 7], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={r} style={{overflow: 'hidden'}}>
                <div
                  style={{
                    transform: `translateY(${(1 - p) * 105}%)`,
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 96,
                    lineHeight: '94px',
                    letterSpacing: -3,
                    color: i === 1 ? C.cyan : C.ink,
                  }}
                >
                  {r}
                </div>
              </div>
            );
          })}
        </div>
      </Camera>
      <Label index="02" text="Architecture" style={{top: 96, right: 62}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 03 */

const SLAMS = [
  {word: 'FAST', x: 0.5, y: 0.36, rot: -2, style: {color: C.ink}},
  {word: 'SHARP', x: 0.5, y: 0.52, rot: 1.5, style: {color: 'transparent', WebkitTextStroke: `2px ${C.cyan}`}},
  {word: 'ALIVE', x: 0.5, y: 0.68, rot: -1, style: {color: C.pink}},
];

export const Slams: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stripes = (f * 2) % 26;
  const bar = interpolate(f % 42, [0, 8, 30, 42], [0, 1, 1, 0], clamp);
  const barY = interpolate(f % 42, [0, 42], [0, 1080], clamp);

  return (
    <AbsoluteFill style={{background: '#05070f'}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 2px, transparent 2px, transparent 30px)',
          backgroundPosition: `${stripes}px ${stripes}px`,
        }}
      />
      <AbsoluteFill
        style={{
          top: barY - 90,
          height: 180,
          background: `linear-gradient(180deg, transparent, rgba(84,230,255,0.10), transparent)`,
          opacity: bar,
        }}
      />
      {SLAMS.map((s, i) => {
        const local = f - 8 - i * 10;
        const e = spring({frame: local, fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
        const dx = i === 0 ? -120 : i === 1 ? 140 : 0;
        const dy = i === 2 ? 90 : 0;
        return (
          <div
            key={s.word}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${s.y * 100}%`,
              display: 'flex',
              justifyContent: 'center',
              transform: `translate3d(${(1 - e) * dx}px, ${(1 - e) * dy}px, 0) rotate(${s.rot}deg) scale(${0.9 + e * 0.1})`,
              opacity: Math.min(1, Math.max(0, e * 1.6)),
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 268,
                lineHeight: '250px',
                letterSpacing: -14,
                ...s.style,
              }}
            >
              {s.word}
            </span>
          </div>
        );
      })}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 90,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 9,
          color: C.dim,
        }}
      >
        NO FRICTION / NO DEAD FRAMES
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 04 */

export const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const gridY = (f * 9) % 120;
  const rings = Array.from({length: 14});

  return (
    <AbsoluteFill style={{background: '#03040a', perspective: 1000, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d'}}>
        <div
          style={{
            position: 'absolute',
            left: '-100%',
            width: '300%',
            height: '160%',
            bottom: '-72%',
            transform: 'rotateX(74deg)',
            backgroundImage: `linear-gradient(rgba(84,230,255,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(84,230,255,0.28) 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0px ${gridY}px`,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-100%',
            width: '300%',
            height: '160%',
            top: '-72%',
            transform: 'rotateX(-74deg)',
            backgroundImage: `linear-gradient(rgba(154,92,255,0.36) 1px, transparent 1px), linear-gradient(90deg, rgba(154,92,255,0.22) 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0px ${gridY}px`,
            opacity: 0.5,
          }}
        />
      </div>
      <AbsoluteFill style={center}>
        {rings.map((_, i) => {
          const z = -2400 + ((f * 15 + i * 320) % 3000);
          const o = interpolate(z, [-2400, -600, 220, 480], [0, 1, 0.9, 0], clamp);
          const hue = i % 2 === 0 ? C.cyan : C.violet;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 760,
                height: 760,
                borderRadius: '50%',
                border: `1.5px solid ${hue}`,
                boxShadow: `0 0 26px ${hue}33, inset 0 0 40px ${hue}18`,
                transform: `translateZ(${z}px) rotate(${i * 9 + f * 0.4}deg)`,
                opacity: o * 0.85,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 0%, #b9f4ff 18%, rgba(84,230,255,0.5) 42%, transparent 70%)',
            filter: 'blur(2px)',
            transform: `translateY(${Math.sin(f / 12) * 14}px) scale(${1 + Math.sin(f / 9) * 0.04})`,
          }}
        />
      </AbsoluteFill>
      {Array.from({length: 26}).map((_, i) => {
        const r = rand(i + 5);
        const y = r() * 1080;
        const speed = 18 + r() * 42;
        const len = 60 + r() * 240;
        const x = -400 + ((f * speed + r() * 2400) % 2800);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: y,
              left: x,
              width: len,
              height: 2,
              background: i % 3 === 0 ? C.pink : C.cyan,
              opacity: 0.18 + r() * 0.35,
            }}
          />
        );
      })}
      <Label index="04" text="Velocity" style={{bottom: 96, left: 62}} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 86,
          fontFamily: MONO,
          fontSize: 17,
          letterSpacing: 13,
          color: 'rgba(238,244,255,0.6)',
        }}
      >
        THROUGH
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 05 */

type Pt = [number, number];
const cache: Record<string, Pt[]> = {};

const poly = (kind: 'circle' | 'square' | 'triangle', n: number): Pt[] => {
  const key = `${kind}${n}`;
  if (cache[key]) return cache[key];
  const pts: Pt[] = [];
  if (kind === 'circle') {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      pts.push([Math.cos(a), Math.sin(a)]);
    }
  } else {
    const verts: Pt[] =
      kind === 'square'
        ? [[0, -1], [1, 0], [0, 1], [-1, 0]]
        : [[0, -1], [0.866, 0.5], [-0.866, 0.5]];
    const seg = n / verts.length;
    for (let i = 0; i < n; i++) {
      const s = Math.floor(i / seg);
      const t = (i % seg) / seg;
      const a = verts[s];
      const b = verts[(s + 1) % verts.length];
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  cache[key] = pts;
  return pts;
};

const SHAPES: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

export const Morph: React.FC = () => {
  const f = useCurrentFrame();
  const n = 64;
  const phase = (f / 190) * 3;
  const idx = Math.min(2, Math.floor(phase));
  const local = easeInOut(phase - idx);
  const A = poly(SHAPES[idx], n);
  const B = poly(SHAPES[idx + 1] ?? 'circle', n);
  const clip =
    'polygon(' +
    A.map((a, i) => {
      const x = lerp(a[0], B[i][0], local);
      const y = lerp(a[1], B[i][1], local);
      return `${(50 + x * 50).toFixed(2)}% ${(50 + y * 50).toFixed(2)}%`;
    }).join(', ') +
    ')';

  const spin = f * 1.1;

  return (
    <AbsoluteFill style={{background: '#04060d'}}>
      <GridDots gap={90} opacity={0.07} />
      <AbsoluteFill style={center}>
        <div style={{position: 'relative', width: 780, height: 780}}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width="780"
              height="780"
              viewBox="0 0 780 780"
              style={{position: 'absolute', inset: 0, transform: `rotate(${spin * (i % 2 === 0 ? 1 : -1) * 0.5 + i * 40}deg)`}}
            >
              <circle
                cx="390"
                cy="390"
                r={340 - i * 34}
                fill="none"
                stroke={i === 1 ? C.violet : C.cyan}
                strokeWidth="1"
                strokeDasharray={i === 0 ? '3 14' : i === 1 ? '40 26' : '2 8'}
                opacity={0.55}
              />
            </svg>
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 90,
              clipPath: clip,
              background: `conic-gradient(from ${f * 3}deg, ${C.cyan}, ${C.blue}, ${C.violet}, ${C.pink}, ${C.cyan})`,
              opacity: 0.92,
              boxShadow: `0 0 120px ${C.violet}44`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 138,
              clipPath: clip,
              background: 'radial-gradient(circle at 50% 40%, rgba(4,6,13,0.55), rgba(4,6,13,0.95) 70%)',
            }}
          />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 120, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 6}}>
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 8, color: C.cyan}}>05 — MORPH</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: '76px', letterSpacing: -2, textAlign: 'right'}}>
          FORM
          <br />
          FOLLOWS
          <br />
          MOTION
        </div>
      </div>
      <Corners />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 06 */

const hash = (a: number, b: number, c: number) => {
  let h = a * 374761393 + b * 668265263 + c * 1274126177;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) >>> 0;
};

export const DataWall: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 11;
  const rows = 30;
  const reveal = interpolate(f, [40, 90], [0, 1], {...clamp, easing: easeOut});
  const counter = Math.floor(interpolate(f, [0, 190], [0, 4096], clamp));

  return (
    <AbsoluteFill style={{background: '#02040a'}}>
      <AbsoluteFill style={{opacity: 0.5}}>
        {Array.from({length: cols}).map((_, c) => {
          const speed = 1.5 + ((c * 7) % 9) * 0.9;
          const off = (f * speed + c * 57) % 32;
          return (
            <div
              key={c}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(c / cols) * 100}%`,
                width: `${100 / cols}%`,
                overflow: 'hidden',
                borderLeft: '1px solid rgba(84,230,255,0.06)',
              }}
            >
              <div style={{transform: `translateY(-${off * 2}px)`, paddingTop: 20}}>
                {Array.from({length: rows}).map((_, r) => (
                  <div
                    key={r}
                    style={{
                      fontFamily: MONO,
                      fontSize: 19,
                      lineHeight: '34px',
                      color: r % 7 === 0 ? C.cyan : 'rgba(150,190,255,0.5)',
                      opacity: 0.22 + ((hash(c, r, Math.floor(f / 6)) % 60) / 100),
                    }}
                  >
                    {String(hash(c, r, Math.floor(f / 4)) % 10000).padStart(4, '0')}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (f * 5) % 1080,
          height: 140,
          background: `linear-gradient(180deg, transparent, rgba(84,230,255,0.16), transparent)`,
          borderTop: `1px solid ${C.cyan}44`,
        }}
      />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(2,4,10,0.92) 0%, rgba(2,4,10,0.35) 46%, rgba(2,4,10,0.9) 100%)'}} />
      <div style={{position: 'absolute', left: 118, bottom: 150}}>
        {['BUILD', 'AT SPEED'].map((l, i) => (
          <div key={l} style={{overflow: 'hidden'}}>
            <div style={{transform: `translateX(${(1 - reveal) * -110}%)`, fontFamily: FONT, fontWeight: 900, fontSize: 132, lineHeight: '128px', letterSpacing: -5}}>
              {l}
            </div>
          </div>
        ))}
        <div style={{marginTop: 26, fontFamily: MONO, fontSize: 17, letterSpacing: 7, color: C.dim, opacity: reveal}}>
          ITERATIONS / {counter.toString().padStart(4, '0')}
        </div>
      </div>
      <Label index="06" text="Throughput" style={{top: 96, right: 62}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 07 */

const MiniWave: React.FC<{f: number; color: string}> = ({f, color}) => {
  const pts = Array.from({length: 40}, (_, i) => {
    const x = (i / 39) * 100;
    const y = 50 + Math.sin(i * 0.5 + f * 0.2) * 28;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const MiniRing: React.FC<{f: number}> = ({f}) => (
  <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 60 + i * 26,
          height: 60 + i * 26,
          borderRadius: '50%',
          border: `1.5px solid ${C.cyan}`,
          opacity: 0.7 - i * 0.2,
          transform: `rotate(${f * (2 + i)}deg)`,
          borderTopColor: 'transparent',
        }}
      />
    ))}
  </div>
);

const MiniBars: React.FC<{f: number}> = ({f}) => (
  <div style={{display: 'flex', gap: 5, alignItems: 'flex-end', height: '100%', padding: '14px 0'}}>
    {Array.from({length: 12}).map((_, i) => (
      <div key={i} style={{flex: 1, height: `${20 + Math.abs(Math.sin(i * 0.7 + f * 0.25)) * 70}%`, background: C.violet, opacity: 0.85}} />
    ))}
  </div>
);

const MiniScan: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(84,230,255,0.5) 1px, transparent 1px)', backgroundSize: '12px 12px'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: `${(f * 3) % 100}%`, height: 2, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}`}} />
  </div>
);

export const Panels: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const merge = interpolate(f, [96, 136], [0, 1], {...clamp, easing: easeInOut});
  const headline = interpolate(f, [112, 150], [0, 1], {...clamp, easing: easeOut});
  const panels = [
    {r: 0, c: 0, kind: 'wave'},
    {r: 0, c: 1, kind: 'ring'},
    {r: 0, c: 2, kind: 'bars'},
    {r: 1, c: 0, kind: 'scan'},
    {r: 1, c: 1, kind: 'count'},
    {r: 1, c: 2, kind: 'wave2'},
  ];
  const PW = (1780 - 32) / 3;
  const PH = (900 - 32) / 2;

  return (
    <AbsoluteFill style={{background: '#04060d'}}>
      {panels.map((p, i) => {
        const e = spring({frame: f - 6 - i * 4, fps, config: {damping: 18, stiffness: 140}});
        const cx = 30 + p.c * (PW + 16) + PW / 2;
        const cy = 90 + p.r * (PH + 16) + PH / 2;
        const dx = (960 - cx) * merge;
        const dy = (540 - cy) * merge;
        const inner =
          p.kind === 'wave' ? <MiniWave f={f} color={C.cyan} /> :
          p.kind === 'wave2' ? <MiniWave f={f * 1.4 + 20} color={C.pink} /> :
          p.kind === 'ring' ? <MiniRing f={f} /> :
          p.kind === 'bars' ? <MiniBars f={f} /> :
          p.kind === 'scan' ? <MiniScan f={f} /> :
          <div style={{...center, height: '100%', fontFamily: MONO, fontSize: 54, color: C.amber}}>{Math.floor(interpolate(f, [0, 190], [1000, 9999]))}</div>;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 30 + p.c * (PW + 16),
              top: 90 + p.r * (PH + 16),
              width: PW,
              height: PH,
              border: '1px solid rgba(238,244,255,0.13)',
              background: 'rgba(255,255,255,0.018)',
              overflow: 'hidden',
              padding: 22,
              opacity: Math.min(1, e * 1.4) * (1 - merge * 0.85),
              transform: `translate3d(${dx}px, ${dy}px, 0) scale(${0.94 + e * 0.06 + merge * 0.3})`,
            }}
          >
            <div style={{position: 'absolute', top: 12, left: 16, fontFamily: MONO, fontSize: 12, letterSpacing: 4, color: 'rgba(238,244,255,0.4)'}}>
              {String(i + 1).padStart(2, '0')} / NODE
            </div>
            <div style={{position: 'absolute', inset: 40, top: 46}}>{inner}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{...center, opacity: headline, pointerEvents: 'none'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: 10, color: C.cyan, marginBottom: 10}}>07 — CONVERGENCE</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, letterSpacing: -6, lineHeight: '140px'}}>ONE SYSTEM</div>
        </div>
      </AbsoluteFill>
      <Corners inset={46} size={26} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 08 */

export const Waves: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    {amp: 90, freq: 0.004, speed: 0.03, base: 300, w: 2.4, color: C.cyan, op: 0.95},
    {amp: 120, freq: 0.0032, speed: 0.022, base: 430, w: 1.4, color: C.blue, op: 0.7},
    {amp: 70, freq: 0.005, speed: 0.038, base: 540, w: 1, color: C.violet, op: 0.8},
    {amp: 140, freq: 0.0026, speed: 0.018, base: 660, w: 1, color: C.pink, op: 0.55},
    {amp: 60, freq: 0.006, speed: 0.045, base: 760, w: 1, color: C.ink, op: 0.3},
  ];
  const text = 'RHYTHM'.split('');

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, rgba(40,80,190,${0.18 + Math.sin(f / 22) * 0.06}), #03050b 68%)`}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0" />
            <stop offset="30%" stopColor={C.cyan} stopOpacity="1" />
            <stop offset="70%" stopColor={C.violet} stopOpacity="1" />
            <stop offset="100%" stopColor={C.pink} stopOpacity="0" />
          </linearGradient>
        </defs>
        {rows.map((r, k) => {
          const d = Array.from({length: 64}, (_, i) => {
            const x = (i / 63) * 1920;
            const y = r.base + Math.sin(x * r.freq + f * r.speed + k) * r.amp + Math.sin(x * r.freq * 2.4 - f * r.speed * 0.6) * r.amp * 0.25;
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');
          return (
            <g key={k}>
              <path d={d} fill="none" stroke={r.color} strokeWidth={r.w * 7} opacity={r.op * 0.09} />
              <path d={d} fill="none" stroke="url(#wave)" strokeWidth={r.w} opacity={r.op} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={center}>
        <div style={{display: 'flex', marginTop: -40}}>
          {text.map((ch, i) => (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 240,
                letterSpacing: -6,
                color: C.ink,
                display: 'inline-block',
                transform: `translateY(${Math.sin(f * 0.12 + i * 0.6) * 20}px) rotate(${Math.sin(f * 0.1 + i) * 2}deg)`,
                textShadow: `0 0 60px rgba(84,230,255,0.35)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </AbsoluteFill>
      <Label index="08" text="Frequency" style={{bottom: 96, left: 62}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 09 */

export const Rings: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [150, 168, 190], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(90,40,160,0.35), #02030a 62%)'}}>
      <AbsoluteFill style={center}>
        {Array.from({length: 18}).map((_, i) => {
          const p = ((f + i * 96) % 920) / 920;
          const s = 0.18 + easeOut(p) * 4.2;
          const o = (1 - p) * 0.9;
          const color = i % 4 === 0 ? C.pink : i % 3 === 0 ? C.violet : C.cyan;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 520,
                height: 520,
                borderRadius: 18 + (i % 5) * 10,
                border: `1.5px solid ${color}`,
                transform: `scale(${s}) rotate(${i * 7 + f * 0.25}deg)`,
                opacity: o,
                boxShadow: `0 0 30px ${color}22`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            width: 220 + Math.sin(f / 7) * 18,
            height: 220 + Math.sin(f / 7) * 18,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, #c8f6ff 22%, rgba(84,230,255,0.45) 50%, transparent 72%)',
            filter: 'blur(1px)',
          }}
        />
      </AbsoluteFill>
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 150 + i * 92,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${i % 2 ? C.violet : C.cyan}55, transparent)`,
            opacity: 0.5,
          }}
        />
      ))}
      <Label index="09" text="Acceleration" style={{top: 96, left: 62}} />
      <AbsoluteFill style={{...center, opacity: flash, background: C.ink}} />
      <div style={{position: 'absolute', right: 86, bottom: 96, fontFamily: MONO, fontSize: 16, letterSpacing: 10, color: C.dim}}>
        NO BRAKES
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 10 */

export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: f - 4, fps, config: {damping: 200}});
  const sweep = interpolate(f, [0, 220], [0, 100], clamp);
  const line = interpolate(f, [30, 100], [0, 780], {...clamp, easing: easeOut});
  const sub = interpolate(f, [60, 100], [0, 1], clamp);
  const tiltY = Math.sin(f / 46) * 5;
  const tiltX = Math.cos(f / 58) * 2.5;
  const orb1 = 260 + Math.sin(f / 34) * 60;
  const orb2 = 220 + Math.cos(f / 40) * 50;

  return (
    <AbsoluteFill style={{background: '#03050b'}}>
      <div
        style={{
          position: 'absolute',
          width: orb1 * 2,
          height: orb1 * 2,
          left: 120 - orb1,
          top: 80 - orb1,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.violet}33, transparent 66%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: orb2 * 2,
          height: orb2 * 2,
          right: 100 - orb2,
          bottom: -orb2,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.cyan}2e, transparent 66%)`,
        }}
      />
      <Camera zoom={1} rotX={tiltX} rotY={tiltY}>
        <AbsoluteFill style={center}>
          <div style={{textAlign: 'center', transform: `scale(${0.95 + e * 0.05})`, opacity: e}}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 268,
                lineHeight: '250px',
                letterSpacing: -12,
                backgroundImage: `linear-gradient(100deg, #ffffff 0%, ${C.cyan} 28%, ${C.violet} 52%, ${C.pink} 72%, #ffffff 100%)`,
                backgroundSize: '320% 100%',
                backgroundPosition: `${sweep}% 0%`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              KINETIC
            </div>
            <div style={{width: line, height: 1, margin: '18px auto 0', background: `linear-gradient(90deg, transparent, ${C.ink}, transparent)`}} />
            <div
              style={{
                marginTop: 24,
                fontFamily: MONO,
                fontSize: 17,
                letterSpacing: 12,
                color: C.dim,
                opacity: sub,
                transform: `translateY(${(1 - sub) * 14}px)`,
              }}
            >
              SESSENTA SEGUNDOS DE MOVIMENTO
            </div>
          </div>
        </AbsoluteFill>
      </Camera>
      <Corners inset={54} size={40} />
      <div style={{position: 'absolute', left: 62, bottom: 96, fontFamily: MONO, fontSize: 14, letterSpacing: 6, color: 'rgba(238,244,255,0.4)'}}>
        COMPOSED IN REMOTION
      </div>
      <div style={{position: 'absolute', right: 62, bottom: 96, fontFamily: MONO, fontSize: 14, letterSpacing: 6, color: 'rgba(238,244,255,0.4)'}}>
        1920 × 1080 / 30 FPS
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 11 */

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20, 96, 100], [0, 1, 1, 0], clamp);
  const bar = interpolate(f, [0, 90], [0, 100], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{...center, background: '#03050b', opacity: o}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 9, color: C.dim, marginBottom: 22}}>RENDERED ON GITHUB ACTIONS</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: -1}}>built with Remotion</div>
        <div style={{margin: '46px auto 0', width: 560, height: 2, background: 'rgba(255,255,255,0.12)'}}>
          <div style={{width: `${bar}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.cyan}, ${C.pink})`}} />
        </div>
        <div style={{marginTop: 16, fontFamily: MONO, fontSize: 14, letterSpacing: 5, color: 'rgba(238,244,255,0.4)'}}>60.00 s</div>
      </div>
    </AbsoluteFill>
  );
};
