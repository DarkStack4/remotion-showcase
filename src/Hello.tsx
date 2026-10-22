import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill} from 'remotion';

export const Hello: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const entrada = spring({frame, fps, config: {damping: 200}});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const translateY = interpolate(entrada, [0, 1], [80, 0]);
  const escala = interpolate(entrada, [0, 1], [0.6, 1]);
  const barra = interpolate(frame, [20, durationInFrames - 10], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 40%, #16224a 0%, #0b1020 60%, #05070f 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${escala})`,
          opacity,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 110,
            letterSpacing: -2,
            color: '#ffffff',
            textShadow: '0 0 40px rgba(90,140,255,0.55)',
          }}
        >
          Remotion
        </h1>
        <p
          style={{
            margin: '18px 0 0',
            fontSize: 32,
            color: '#8fb0ff',
            opacity: subOpacity,
            letterSpacing: 3,
          }}
        >
          animacao gerada do zero
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 90,
          width: 520,
          height: 8,
          borderRadius: 99,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${barra}%`,
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #4f7cff, #9b6bff)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
