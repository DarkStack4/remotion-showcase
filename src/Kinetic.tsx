import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './kinetic/theme';
import {CutFx, Grain, HUD, Shot, Vignette} from './kinetic/ui';
import type {FxKind} from './kinetic/ui';
import {DataWall, Finale, Morph, Network, Open, Outro, Panels, Rings, Slams, Tunnel, Waves} from './kinetic/scenes';

const CUTS: Array<{at: number; dur: number; fx: FxKind}> = [
  {at: 90, dur: 24, fx: 'nodes'},
  {at: 265, dur: 20, fx: 'slabs'},
  {at: 440, dur: 22, fx: 'streaks'},
  {at: 615, dur: 26, fx: 'morph'},
  {at: 790, dur: 22, fx: 'digits'},
  {at: 965, dur: 22, fx: 'tiles'},
  {at: 1140, dur: 24, fx: 'wave'},
  {at: 1315, dur: 24, fx: 'ring'},
  {at: 1490, dur: 22, fx: 'flash'},
  {at: 1700, dur: 20, fx: 'none'},
];

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
      <Shot from={0} duration={114} reveal="cut" exit="shrink" exitDur={24}>
        <Open />
      </Shot>
      <Shot from={90} duration={195} reveal="iris" revealDur={24} exit="none">
        <Network />
      </Shot>
      <Shot from={265} duration={197} reveal="glitch" revealDur={20} exit="none">
        <Slams />
      </Shot>
      <Shot from={440} duration={201} reveal="zoom" revealDur={22} exit="shrink" exitDur={26}>
        <Tunnel />
      </Shot>
      <Shot from={615} duration={197} reveal="diamond" revealDur={26} exit="none">
        <Morph />
      </Shot>
      <Shot from={790} duration={197} reveal="shutter" revealDur={22} exit="none">
        <DataWall />
      </Shot>
      <Shot from={965} duration={199} reveal="diagonal" revealDur={22} exit="left" exitDur={22}>
        <Panels />
      </Shot>
      <Shot from={1140} duration={199} reveal="wave" revealDur={24} exit="none">
        <Waves />
      </Shot>
      <Shot from={1315} duration={195} reveal="iris" revealDur={24} exit="zoom" exitDur={24}>
        <Rings />
      </Shot>
      <Shot from={1490} duration={230} reveal="zoom" revealDur={22} exit="fade" exitDur={22}>
        <Finale />
      </Shot>
      <Shot from={1700} duration={100} reveal="cut" exit="none">
        <Outro />
      </Shot>

      {CUTS.map((c) => (
        <Sequence key={c.at} from={c.at} durationInFrames={c.dur} layout="none">
          <CutFx kind={c.fx} duration={c.dur} />
        </Sequence>
      ))}

      <Grain opacity={0.075} />
      <Vignette />
      <HUD />
      <AbsoluteFill style={{background: '#000', opacity: fade, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
