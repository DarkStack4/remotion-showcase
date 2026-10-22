import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
} from 'remotion';

export const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const bgHue = interpolate(frame, [0, durationInFrames], [220, 360], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, hsl(${bgHue} 60% 18%) 0%, #05070f 75%)`,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        color: '#ffffff',
      }}
    >
      <Sequence from={0} durationInFrames={450}>
        <SceneIntro fps={fps} />
      </Sequence>
      <Sequence from={420} durationInFrames={510}>
        <ScenePulse />
      </Sequence>
      <Sequence from={900} durationInFrames={480}>
        <SceneGrid />
      </Sequence>
      <Sequence from={1350} durationInFrames={450}>
        <SceneOutro fps={fps} durationInFrames={durationInFrames} />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 60,
          fontSize: 18,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 2,
        }}
      >
        FRAME {String(frame).padStart(4, '0')} / {durationInFrames}
      </div>
    </AbsoluteFill>
  );
};

const SceneIntro: React.FC<{fps: number}> = ({fps}) => {
  const frame = useCurrentFrame();
  const e = spring({frame, fps, config: {damping: 160, stiffness: 90}});
  const scale = interpolate(e, [0, 1], [0.4, 1]);
  const y = interpolate(e, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 25], [0, 1], {extrapolateRight: 'clamp'});
  const sub = interpolate(frame, [30, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `translateY(${y}px) scale(${scale})`, opacity, textAlign: 'center'}}>
        <h1 style={{margin: 0, fontSize: 150, letterSpacing: -4, textShadow: '0 0 60px rgba(120,170,255,0.6)'}}>
          Sixty Seconds
        </h1>
        <p style={{margin: '24px 0 0', fontSize: 34, color: '#9bb6ff', opacity: sub, letterSpacing: 4}}>
          REMOTION SHOWCASE
        </p>
      </div>
    </AbsoluteFill>
  );
};

const ScenePulse: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const orbs = Array.from({length: 7});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {orbs.map((_, i) => {
        const delay = i * 8;
        const s = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 120}});
        const size = 60 + i * 46;
        const rot = frame * (0.6 + i * 0.15);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `2px solid hsla(${200 + i * 22}, 80%, 65%, ${0.5 - i * 0.05})`,
              transform: `rotate(${rot}deg) scale(${s})`,
              boxShadow: `0 0 40px hsla(${200 + i * 22}, 80%, 65%, 0.35)`,
            }}
          />
        );
      })}
      <div style={{fontSize: 46, letterSpacing: 6, color: '#ffffff', textShadow: '0 0 30px rgba(120,170,255,0.7)'}}>
        PULSE
      </div>
    </AbsoluteFill>
  );
};

const SceneGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const cells = Array.from({length: 64});
  return (
    <AbsoluteFill style={{padding: 80, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16, alignItems: 'center'}}>
      {cells.map((_, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const delay = (col + row) * 3;
        const v = interpolate(frame - delay, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const hue = (i * 14 + frame * 2) % 360;
        return (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              borderRadius: 12,
              background: `hsl(${hue} 70% 55%)`,
              opacity: v,
              transform: `scale(${0.6 + v * 0.4})`,
              boxShadow: `0 0 20px hsla(${hue}, 70%, 55%, 0.4)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC<{fps: number; durationInFrames: number}> = ({fps, durationInFrames}) => {
  const frame = useCurrentFrame();
  const local = frame;
  const total = durationInFrames;
  const e = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  const barra = interpolate(local, [0, total], [0, 100], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{opacity, transform: `scale(${interpolate(e, [0, 1], [0.85, 1])})`}}>
        <h1 style={{margin: 0, fontSize: 120, letterSpacing: -2}}>Done.</h1>
        <p style={{margin: '18px 0 0', fontSize: 30, color: '#9bb6ff', letterSpacing: 4}}>60 SECONDS RENDERED</p>
      </div>
      <div style={{position: 'absolute', bottom: 90, width: 720, height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
        <div style={{width: `${barra}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4f7cff, #9b6bff, #ff6b9b)'}} />
      </div>
    </AbsoluteFill>
  );
};
