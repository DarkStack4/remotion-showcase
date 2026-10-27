import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {wallFramesDefaultProps} from './defaults';
import {FRAME_W, PIN_OFFSET_Y, Pin, Polaroid, StringLine} from './parts';
import type {EvidenceFrame, WallFramesProps} from './types';

const W = 1080;
const H = 1920;

export const WallFrames: React.FC<Partial<WallFramesProps>> = (props) => {
  const {
    caseLabel,
    title,
    stamp,
    footer,
    titleSize = 84,
  } = {...wallFramesDefaultProps, ...props};
  const frames = props.frames ?? wallFramesDefaultProps.frames;
  const links = props.links ?? wallFramesDefaultProps.links;
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const cameraScale = 1.015 + progress * 0.07;
  const cameraX = interpolate(progress, [0, 1], [-14, 12]);
  const cameraY = interpolate(progress, [0, 1], [8, -12]);
  const flicker = 0.1 + Math.sin(frame * 0.43) * 0.012 + Math.sin(frame * 1.7) * 0.006;
  const titleIn = spring({frame: frame - 6, fps: 30, config: {damping: 14, mass: 0.8}});
  const stampIn = spring({frame: frame - 58, fps: 30, config: {damping: 11, mass: 0.7}});

  const pinOf = (item: EvidenceFrame) => ({
    x: item.x + FRAME_W / 2,
    y: item.y + PIN_OFFSET_Y,
  });
  const byId = new Map(frames.map((item) => [item.id, item]));

  return (
    <AbsoluteFill style={{background: '#0a0908', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: -80,
          background:
            'radial-gradient(ellipse at 52% 30%, rgba(122,106,82,0.34) 0%, rgba(20,17,14,0.2) 45%, rgba(0,0,0,0.9) 78%), repeating-linear-gradient(0deg, rgba(255,255,255,0.016) 0px, rgba(255,255,255,0.016) 1px, transparent 1px, transparent 5px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 34,
          right: 44,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [-24, 0])}px)`,
        }}
      >
        <div style={{fontFamily: '"Courier New", monospace', color: '#a99d84', fontSize: 18, letterSpacing: 5}}>
          {caseLabel}
        </div>
        <div
          style={{
            fontFamily: 'Impact, "Arial Black", sans-serif',
            color: '#e9dfc7',
            fontSize: titleSize,
            lineHeight: 0.92,
            letterSpacing: 2,
            marginTop: 8,
            whiteSpace: 'pre-line',
            textShadow: '0 4px 0 #3a2a1b, 0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 216,
          width: 1000,
          height: 1400,
          transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraScale})`,
          transformOrigin: '50% 45%',
          background:
            'radial-gradient(circle at 40% 25%, #6b5138 0%, #4b3523 42%, #2e2014 100%)',
          boxShadow: '0 34px 70px rgba(0,0,0,0.8), inset 0 0 90px rgba(0,0,0,0.55)',
          border: '18px solid #24160d',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.32,
            background:
              'repeating-linear-gradient(17deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(103deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 180,
            left: 330,
            top: 690,
            background: 'rgba(20,12,7,0.22)',
            transform: 'rotate(-2deg)',
            boxShadow: '0 0 40px rgba(0,0,0,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 190,
            height: 120,
            left: 72,
            top: 470,
            background: 'rgba(226,204,135,0.13)',
            transform: 'rotate(4deg)',
            border: '1px solid rgba(226,204,135,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 150,
            height: 96,
            left: 770,
            top: 1110,
            background: 'rgba(226,204,135,0.1)',
            transform: 'rotate(-5deg)',
            border: '1px solid rgba(226,204,135,0.1)',
          }}
        />

        <svg
          width="1000"
          height="1400"
          viewBox="0 0 1000 1400"
          style={{position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none'}}
        >
          {links.map((link, index) => {
            const from = byId.get(link.from);
            const to = byId.get(link.to);
            if (!from || !to) {
              return null;
            }
            const a = pinOf(from);
            const b = pinOf(to);
            const cx = (a.x + b.x) / 2;
            const cy = (a.y + b.y) / 2 + (link.bend ?? -40);
            return (
              <StringLine
                key={`${link.from}-${link.to}-${index}`}
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                delay={link.delay ?? 116 + index * 12}
              />
            );
          })}
        </svg>

        {frames.map((item, index) => (
          <Polaroid key={item.id} item={item} index={index} />
        ))}

        {frames.map((item, index) => {
          const p = pinOf(item);
          return <Pin key={`pin-${item.id}`} x={p.x} y={p.y} delay={(item.delay ?? 8 + index * 8) + 26} />;
        })}

        <div
          style={{
            position: 'absolute',
            right: 34,
            bottom: 34,
            zIndex: 40,
            border: '4px solid rgba(176,32,24,0.72)',
            color: 'rgba(196,45,34,0.82)',
            fontFamily: '"Courier New", monospace',
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: 3,
            padding: '8px 14px',
            transform: `rotate(-11deg) scale(${interpolate(stampIn, [0, 1], [1.7, 1])})`,
            opacity: interpolate(stampIn, [0, 0.4, 1], [0, 0.85, 0.72]),
            mixBlendMode: 'multiply',
          }}
        >
          {stamp}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 58,
          textAlign: 'center',
          fontFamily: '"Courier New", monospace',
          color: '#8b7d65',
          fontSize: 17,
          letterSpacing: 5,
          opacity: 0.8,
        }}
      >
        {footer}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 42%, transparent 32%, rgba(0,0,0,0.52) 100%)',
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(115deg, rgba(255,214,160,0.05), transparent 36%, rgba(0,0,0,0.14))',
          opacity: flicker * 8,
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.055, pointerEvents: 'none'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
