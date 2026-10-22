import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './kinetic/theme';
import {Grain, HUD, Shot, Vignette} from './kinetic/ui';
import {DataWall, Finale, Morph, Network, Open, Outro, Panels, Rings, Slams, Tunnel, Waves} from './kinetic/scenes';

export const Kinetic: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const hue = interpolate(f, [0, durationInFrames], [196, 268]);
  const fade = interpolate(f, [durationInFrames - 26, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 42%, hsl(${hue} 62% 11%) 0%, ${C.bg1} 46%, ${C.bg0} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Shot from={0} duration={100} enter="cut" exit="left">
        <Open />
      </Shot>
      <Shot from={90} duration={190} enter="right" exit="left">
        <Network />
      </Shot>
      <Shot from={265} duration={190} enter="right" exit="left">
        <Slams />
      </Shot>
      <Shot from={440} duration={190} enter="right" exit="left">
        <Tunnel />
      </Shot>
      <Shot from={615} duration={190} enter="right" exit="left">
        <Morph />
      </Shot>
      <Shot from={790} duration={190} enter="right" exit="left">
        <DataWall />
      </Shot>
      <Shot from={965} duration={190} enter="right" exit="left">
        <Panels />
      </Shot>
      <Shot from={1140} duration={190} enter="right" exit="left">
        <Waves />
      </Shot>
      <Shot from={1315} duration={190} enter="right" exit="left">
        <Rings />
      </Shot>
      <Shot from={1490} duration={220} enter="zoom" exit="cut">
        <Finale />
      </Shot>
      <Shot from={1700} duration={100} enter="cut" exit="cut">
        <Outro />
      </Shot>

      <Grain opacity={0.075} />
      <Vignette />
      <HUD />
      <AbsoluteFill style={{background: '#000', opacity: fade, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
