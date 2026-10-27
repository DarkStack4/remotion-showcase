import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const W = 1080;
const H = 1920;

type FrameSpec = {
  x: number;
  y: number;
  rot: number;
  delay: number;
  code: string;
  title: string;
  children: React.ReactNode;
};

const Pin: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
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

const Polaroid: React.FC<FrameSpec> = ({x, y, rot, delay, code, title, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
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
        left: x,
        top: y + yOffset,
        width: 260,
        height: 326,
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
        {children}
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
        <div style={{fontSize: 17, fontWeight: 700, letterSpacing: 1.1}}>{title}</div>
        <div style={{fontSize: 11, opacity: 0.62, marginTop: 3, letterSpacing: 1}}>{code}</div>
      </div>
    </div>
  );
};

const SuspectPhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#5e5a50,#2b2924)'}}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 34 + i * 32, height: 1, background: 'rgba(255,255,255,0.13)'}} />
    ))}
    <div style={{position: 'absolute', left: 74, top: 38, width: 88, height: 104, borderRadius: '48% 48% 42% 42%', background: '#151412', boxShadow: 'inset -8px -10px 18px rgba(255,255,255,0.05)'}} />
    <div style={{position: 'absolute', left: 38, top: 128, width: 160, height: 110, borderRadius: '50% 50% 0 0', background: '#151412'}} />
    <div style={{position: 'absolute', left: 58, top: 62, width: 34, height: 7, background: 'rgba(240,230,210,0.32)'}} />
    <div style={{position: 'absolute', left: 142, top: 62, width: 34, height: 7, background: 'rgba(240,230,210,0.32)'}} />
    <div style={{position: 'absolute', left: 76, bottom: 12, width: 84, height: 2, background: 'rgba(255,255,255,0.25)'}} />
    <div style={{position: 'absolute', right: 8, top: 8, color: '#d9d0bc', fontFamily: '"Courier New", monospace', fontSize: 11, border: '1px solid rgba(217,208,188,0.5)', padding: '3px 5px'}}>047</div>
  </div>
);

const ScenePhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 58% 42%, #555044 0%, #211f1b 62%, #0c0b0a 100%)'}}>
    <svg width="234" height="232" viewBox="0 0 234 232" style={{position: 'absolute', inset: 0}}>
      <ellipse cx="121" cy="158" rx="66" ry="28" fill="rgba(96,10,10,0.38)" />
      <g stroke="#e6ddc6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 5">
        <circle cx="62" cy="151" r="17" />
        <path d="M79 151 C101 142 121 144 143 151" />
        <path d="M99 148 L79 121" />
        <path d="M99 154 L71 177" />
        <path d="M124 149 L114 116" />
        <path d="M126 153 L153 179" />
        <path d="M143 151 L168 140" />
      </g>
      <path d="M18 18 L34 18 M18 18 L18 34" stroke="rgba(230,221,198,0.35)" strokeWidth="2" />
      <path d="M216 214 L200 214 M216 214 L216 198" stroke="rgba(230,221,198,0.35)" strokeWidth="2" />
    </svg>
    <div style={{position: 'absolute', left: 10, top: 10, width: 5, height: 60, background: '#e8dfca', opacity: 0.7}} />
    <div style={{position: 'absolute', left: 10, top: 10, width: 26, height: 5, background: '#e8dfca', opacity: 0.7}} />
  </div>
);

const WeaponPhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#4c463c,#1b1916 70%)'}}>
    <div style={{position: 'absolute', left: 35, top: 95, width: 152, height: 22, background: 'linear-gradient(180deg,#d8d6cf,#8d8b84 45%,#4b4a46)', transform: 'rotate(-24deg)', boxShadow: '0 8px 12px rgba(0,0,0,0.5)', clipPath: 'polygon(0 42%, 82% 0, 100% 50%, 82% 100%, 0 58%)'}} />
    <div style={{position: 'absolute', left: 160, top: 128, width: 58, height: 16, background: '#2f2118', transform: 'rotate(-24deg)', borderRadius: 3, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15)'}} />
    <div style={{position: 'absolute', left: 20, bottom: 12, width: 92, height: 5, background: '#d7cba8', opacity: 0.8}} />
    <div style={{position: 'absolute', left: 20, bottom: 22, width: 52, height: 3, background: '#d7cba8', opacity: 0.5}} />
    <div style={{position: 'absolute', right: 8, top: 8, width: 26, height: 26, border: '2px solid rgba(255,255,255,0.28)', borderRadius: '50%'}} />
    <div style={{position: 'absolute', right: 18, top: 18, width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)'}} />
  </div>
);

const WitnessPhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#6f6a5c,#302d27)'}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 48 + 20, height: 18, background: 'rgba(0,0,0,0.16)'}} />
    ))}
    <div style={{position: 'absolute', left: 76, top: 42, width: 84, height: 96, borderRadius: '50% 50% 45% 45%', background: '#1b1917'}} />
    <div style={{position: 'absolute', left: 46, top: 128, width: 144, height: 104, borderRadius: '50% 50% 0 0', background: '#1b1917'}} />
    <div style={{position: 'absolute', left: 88, top: 78, width: 60, height: 13, background: '#080706', transform: 'rotate(-2deg)'}} />
    <div style={{position: 'absolute', left: 88, top: 78, width: 60, height: 1, background: 'rgba(255,255,255,0.2)'}} />
    <div style={{position: 'absolute', left: 12, bottom: 12, color: '#e4dcc7', fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: 1}}>TESTEMUNHA 03</div>
  </div>
);

const AlibiPhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#d8d0bc,#a79f8c)'}}>
    <div style={{position: 'absolute', left: 58, top: 30, width: 118, height: 118, borderRadius: '50%', border: '6px solid #2d2a24', background: '#eee7d5'}} />
    <div style={{position: 'absolute', left: 114, top: 44, width: 3, height: 46, background: '#2d2a24', transformOrigin: 'bottom', transform: 'rotate(24deg)'}} />
    <div style={{position: 'absolute', left: 116, top: 86, width: 36, height: 3, background: '#8d1f16', transformOrigin: 'left'}} />
    <div style={{position: 'absolute', left: 58, top: 160, fontFamily: '"Courier New", monospace', fontSize: 26, fontWeight: 700, color: '#2d2a24'}}>23:47</div>
    <div style={{position: 'absolute', left: 58, top: 194, width: 116, height: 8, background: '#2d2a24'}} />
    <div style={{position: 'absolute', left: 58, top: 208, width: 74, height: 8, background: '#2d2a24', opacity: 0.5}} />
    <div style={{position: 'absolute', right: 8, top: 8, width: 40, height: 13, background: 'rgba(141,31,22,0.85)'}} />
  </div>
);

const PhonePhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a2730,#0c1116)'}}>
    <div style={{position: 'absolute', left: 18, top: 24, width: 142, height: 42, borderRadius: '12px 12px 12px 2px', background: '#e8e5dc', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: '8px 10px', boxSizing: 'border-box'}}>onde voce estava?</div>
    <div style={{position: 'absolute', right: 18, top: 82, width: 118, height: 40, borderRadius: '12px 12px 2px 12px', background: '#3f7f68', color: '#f0f5f0', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: '8px 10px', boxSizing: 'border-box'}}>em casa</div>
    <div style={{position: 'absolute', left: 18, top: 140, width: 164, height: 42, borderRadius: '12px 12px 12px 2px', background: '#e8e5dc', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: '8px 10px', boxSizing: 'border-box'}}>prova?</div>
    <div style={{position: 'absolute', right: 18, top: 196, width: 86, height: 34, borderRadius: '12px 12px 2px 12px', background: '#3f7f68', color: '#f0f5f0', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: '8px 10px', boxSizing: 'border-box'}}>nao tenho</div>
  </div>
);

const StringLine: React.FC<{d: string; delay: number}> = ({d, delay}) => {
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

export const WallFrames: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {extrapolateRight: 'clamp'});
  const cameraScale = 1.015 + progress * 0.07;
  const cameraX = interpolate(progress, [0, 1], [-14, 12]);
  const cameraY = interpolate(progress, [0, 1], [8, -12]);
  const flicker = 0.1 + Math.sin(frame * 0.43) * 0.012 + Math.sin(frame * 1.7) * 0.006;
  const titleIn = spring({frame: frame - 6, fps: 30, config: {damping: 14, mass: 0.8}});
  const stampIn = spring({frame: frame - 58, fps: 30, config: {damping: 11, mass: 0.7}});

  const pins = {
    a: {x: 220, y: 182},
    b: {x: 690, y: 132},
    c: {x: 470, y: 482},
    d: {x: 200, y: 772},
    e: {x: 720, y: 772},
    f: {x: 460, y: 1062},
  };

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
          CASO 047 · ARQUIVO MORTO
        </div>
        <div
          style={{
            fontFamily: 'Impact, "Arial Black", sans-serif',
            color: '#e9dfc7',
            fontSize: 84,
            lineHeight: 0.92,
            letterSpacing: 2,
            marginTop: 8,
            textShadow: '0 4px 0 #3a2a1b, 0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          CENA DO
          <br />
          CRIME
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

        <svg width="1000" height="1400" viewBox="0 0 1000 1400" style={{position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none'}}>
          <StringLine d={`M ${pins.a.x} ${pins.a.y} Q 430 320 ${pins.b.x} ${pins.b.y}`} delay={116} />
          <StringLine d={`M ${pins.b.x} ${pins.b.y} Q 590 330 ${pins.c.x} ${pins.c.y}`} delay={128} />
          <StringLine d={`M ${pins.c.x} ${pins.c.y} Q 330 620 ${pins.a.x} ${pins.a.y}`} delay={140} />
          <StringLine d={`M ${pins.c.x} ${pins.c.y} Q 300 610 ${pins.d.x} ${pins.d.y}`} delay={152} />
          <StringLine d={`M ${pins.c.x} ${pins.c.y} Q 620 610 ${pins.e.x} ${pins.e.y}`} delay={164} />
          <StringLine d={`M ${pins.e.x} ${pins.e.y} Q 590 930 ${pins.f.x} ${pins.f.y}`} delay={176} />
          <StringLine d={`M ${pins.d.x} ${pins.d.y} Q 300 930 ${pins.f.x} ${pins.f.y}`} delay={188} />
          <StringLine d={`M ${pins.a.x} ${pins.a.y} Q 170 470 ${pins.d.x} ${pins.d.y}`} delay={200} />
        </svg>

        <Polaroid x={90} y={170} rot={-4} delay={8} code="EVIDÊNCIA 01 · POLAROID" title="SUSPEITO">
          <SuspectPhoto />
        </Polaroid>
        <Polaroid x={560} y={120} rot={3} delay={16} code="EVIDÊNCIA 02 · LOCAL" title="CENA">
          <ScenePhoto />
        </Polaroid>
        <Polaroid x={340} y={470} rot={2} delay={24} code="EVIDÊNCIA 03 · OBJETO" title="ARMA">
          <WeaponPhoto />
        </Polaroid>
        <Polaroid x={70} y={760} rot={3} delay={32} code="EVIDÊNCIA 04 · PESSOA" title="TESTEMUNHA">
          <WitnessPhoto />
        </Polaroid>
        <Polaroid x={590} y={760} rot={-3} delay={40} code="EVIDÊNCIA 05 · HORÁRIO" title="ÁLIBI">
          <AlibiPhoto />
        </Polaroid>
        <Polaroid x={330} y={1050} rot={-2} delay={48} code="EVIDÊNCIA 06 · DIGITAL" title="TELEFONE">
          <PhonePhoto />
        </Polaroid>

        <Pin x={pins.a.x} y={pins.a.y} delay={34} />
        <Pin x={pins.b.x} y={pins.b.y} delay={42} />
        <Pin x={pins.c.x} y={pins.c.y} delay={50} />
        <Pin x={pins.d.x} y={pins.d.y} delay={58} />
        <Pin x={pins.e.x} y={pins.e.y} delay={66} />
        <Pin x={pins.f.x} y={pins.f.y} delay={74} />

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
          CONFIDENCIAL
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
        QUADRO DE EVIDÊNCIAS · 06 PEÇAS
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 42%, transparent 32%, rgba(0,0,0,0.52) 100%)`,
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
