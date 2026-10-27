import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Photo} from './photos';
import type {EvidenceFrame} from './types';

export const FRAME_W = 260;
export const FRAME_H = 326;
export const PIN_OFFSET_Y = 12;

export const Pin: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 10, mass: 0.5, stiffness: 180}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 9,
        top: y - 9,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #ff8a7a 0%, #d8261c 45%, #6d0b06 100%)',
        boxShadow: '0 5px 7px rgba(0,0,0,0.55), inset -2px -2px 3px rgba(0,0,0,0.4)',
        transform: `scale(${s})`,
        zIndex: 30,
      }}
    />
  );
};

export const Polaroid: React.FC<{item: EvidenceFrame; index: number}> = ({item, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delay = item.delay ?? 8 + index * 8;
  const rot = item.rotation ?? 0;
  const drop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 15, mass: 1.1, stiffness: 90},
  });
  const settle = spring({
    frame: frame - delay - 8,
    fps,
    config: {damping: 12, mass: 0.7, stiffness: 120},
  });
  const yOffset = interpolate(drop, [0, 1], [-430, 0], {easing: Easing.out(Easing.cubic)});
  const rotation = interpolate(settle, [0, 1], [rot * 2.8, rot]);
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y + yOffset,
        width: FRAME_W,
        height: FRAME_H,
        opacity,
        transform: `rotate(${rotation}deg)`,
        background: 'linear-gradient(160deg, #f7f1e3 0%, #e8dfca 100%)',
        padding: '13px 13px 0 13px',
        boxShadow: '0 22px 34px rgba(0,0,0,0.55), 0 4px 8px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 234,
          height: 232,
          overflow: 'hidden',
          background: '#171513',
          position: 'relative',
        }}
      >
        <Photo photo={item.photo} />
      </div>
      <div
        style={{
          height: 68,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4px',
          fontFamily: '"Courier New", monospace',
          color: '#2a2118',
        }}
      >
        <div style={{fontSize: 17, fontWeight: 700, letterSpacing: 1.1}}>{item.title}</div>
        <div style={{fontSize: 11, opacity: 0.62, marginTop: 3, letterSpacing: 1}}>{item.code}</div>
      </div>
    </div>
  );
};

export const StringLine: React.FC<{d: string; delay: number}> = ({d, delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <path
      d={d}
      fill="none"
      stroke="#b52118"
      strokeWidth="3.2"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      opacity={0.88}
      style={{filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.5))'}}
    />
  );
};
