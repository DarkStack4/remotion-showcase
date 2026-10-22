import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, MONO, clamp, easeInOut} from './theme';

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

type Move = 'left' | 'right' | 'up' | 'down' | 'zoom' | 'cut';

const IN = 16;
const OUT = 16;

const ShotInner: React.FC<{
  duration: number;
  enter: Move;
  exit: Move;
  children: React.ReactNode;
}> = ({duration, enter, exit, children}) => {
  const f = useCurrentFrame();
  const tin = easeInOut(interpolate(f, [0, IN], [0, 1], clamp));
  const tout = easeInOut(interpolate(f, [duration - OUT, duration], [0, 1], clamp));

  let x = 0;
  let y = 0;
  let scale = 1;
  let opacity = 1;

  const enterK = 1 - tin;
  switch (enter) {
    case 'left':
      x -= enterK * 62;
      scale *= 1 + enterK * 0.06;
      break;
    case 'right':
      x += enterK * 62;
      scale *= 1 + enterK * 0.06;
      break;
    case 'up':
      y += enterK * 62;
      scale *= 1 + enterK * 0.06;
      break;
    case 'down':
      y -= enterK * 62;
      scale *= 1 + enterK * 0.06;
      break;
    case 'zoom':
      scale *= 1 + enterK * 0.35;
      break;
    case 'cut':
      break;
  }

  switch (exit) {
    case 'left':
      x -= tout * 62;
      scale *= 1 + tout * 0.06;
      break;
    case 'right':
      x += tout * 62;
      scale *= 1 + tout * 0.06;
      break;
    case 'up':
      y -= tout * 62;
      scale *= 1 + tout * 0.06;
      break;
    case 'down':
      y += tout * 62;
      scale *= 1 + tout * 0.06;
      break;
    case 'zoom':
      scale *= 1 + tout * 0.45;
      opacity *= 1 - tout * 0.8;
      break;
    case 'cut':
      opacity *= 1 - tout;
      break;
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate3d(${x}%, ${y}%, 0) scale(${scale})`,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Shot: React.FC<{
  from: number;
  duration: number;
  enter?: Move;
  exit?: Move;
  children: React.ReactNode;
}> = ({from, duration, enter = 'right', exit = 'left', children}) => (
  <Sequence from={from} durationInFrames={duration} layout="none">
    <ShotInner duration={duration} enter={enter} exit={exit}>
      {children}
    </ShotInner>
  </Sequence>
);

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
