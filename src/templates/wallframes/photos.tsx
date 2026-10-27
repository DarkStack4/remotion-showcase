import React from 'react';
import {Img} from 'remotion';
import type {EvidencePhoto} from './types';

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

const CardPhoto: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg,#6b6252,#26231f 72%)'}}>
    <div style={{position: 'absolute', left: 24, top: 58, width: 186, height: 118, borderRadius: 9, background: 'linear-gradient(135deg,#29384a,#101820 60%,#1d2b3a)', boxShadow: '0 12px 18px rgba(0,0,0,0.5)', transform: 'rotate(-7deg)', padding: 14, boxSizing: 'border-box'}}>
      <div style={{width: 28, height: 21, borderRadius: 3, background: 'linear-gradient(135deg,#d8bd76,#9b7b35)'}} />
      <div style={{marginTop: 12, color: '#c8d2d8', fontFamily: '"Courier New", monospace', fontSize: 11, letterSpacing: 2}}>•••• •••• •••• 0417</div>
      <div style={{marginTop: 10, color: '#8896a2', fontFamily: '"Courier New", monospace', fontSize: 8, letterSpacing: 1.5}}>CASH CRAB · 09/29</div>
    </div>
    <div style={{position: 'absolute', right: 12, bottom: 12, width: 74, height: 30, border: '2px solid rgba(194,45,34,0.85)', color: 'rgba(194,45,34,0.9)', fontFamily: '"Courier New", monospace', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}>DECLINED</div>
    <div style={{position: 'absolute', left: 12, bottom: 14, width: 72, height: 18, background: 'rgba(232,223,202,0.8)', transform: 'rotate(3deg)'}} />
    <div style={{position: 'absolute', left: 18, bottom: 18, width: 46, height: 2, background: '#3a3329', transform: 'rotate(3deg)'}} />
  </div>
);

const variants = {
  suspect: SuspectPhoto,
  scene: ScenePhoto,
  weapon: WeaponPhoto,
  witness: WitnessPhoto,
  alibi: AlibiPhoto,
  phone: PhonePhoto,
  card: CardPhoto,
};

export const Photo: React.FC<{photo: EvidencePhoto}> = ({photo}) => {
  if (photo.kind === 'image') {
    return (
      <Img
        src={photo.src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: photo.fit ?? 'cover',
          objectPosition: photo.position ?? 'center',
        }}
      />
    );
  }
  const Variant = variants[photo.variant];
  return <Variant />;
};
