import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence} from 'remotion';

const CENAS = [
  {from:0,dur:120},
  {from:110,dur:200},
  {from:290,dur:200},
  {from:470,dur:200},
  {from:650,dur:200},
  {from:830,dur:200},
  {from:1010,dur:200},
  {from:1190,dur:200},
  {from:1370,dur:200},
  {from:1550,dur:200},
  {from:1730,dur:70},
];

export const Kinetic: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const hue = interpolate(frame,[0,durationInFrames],[180,360],{extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, hsl(${hue} 70% 16%) 0%, #05070f 80%)`,fontFamily:'Segoe UI, Arial, sans-serif',color:'#fff'}}>
      <Sequence from={0} durationInFrames={130}><Intro/></Sequence>
      <Sequence from={110} durationInFrames={200}><Particles/></Sequence>
      <Sequence from={290} durationInFrames={200}><Grid/></Sequence>
      <Sequence from={470} durationInFrames={200}><Type/></Sequence>
      <Sequence from={650} durationInFrames={200}><Equalizer/></Sequence>
      <Sequence from={830} durationInFrames={200}><Spiral/></Sequence>
      <Sequence from={1010} durationInFrames={200}><Count/></Sequence>
      <Sequence from={1190} durationInFrames={200}><Mosaic/></Sequence>
      <Sequence from={1370} durationInFrames={200}><ColorShift/></Sequence>
      <Sequence from={1550} durationInFrames={200}><Signature/></Sequence>
      <Sequence from={1730} durationInFrames={70}><Outro/></Sequence>
      <div style={{position:'absolute',bottom:30,right:40,fontSize:16,opacity:.4,letterSpacing:2}}>FRAME {String(frame).padStart(4,'0')}</div>
    </AbsoluteFill>
  );
};

const Intro = () => {
  const f = useCurrentFrame(); const {fps}=useVideoConfig();
  const e = spring({frame:f,fps,config:{damping:14,stiffness:120}});
  const s = interpolate(e,[0,1],[.3,1]);
  const y = interpolate(e,[0,1],[120,0]);
  const o = interpolate(f,[0,20],[0,1],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{transform:`translateY(${y}px) scale(${s})`,opacity:o,textAlign:'center'}}>
      <h1 style={{margin:0,fontSize:200,letterSpacing:-6,textShadow:'0 0 80px rgba(80,200,255,.7)'}}>KINETIC</h1>
      <p style={{margin:'20px 0 0',fontSize:30,letterSpacing:8,color:'#7dd3fc',opacity:interpolate(f,[30,60],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>MOTION / 60s</p>
    </div>
  </AbsoluteFill>;
};

const Particles = () => {
  const f = useCurrentFrame();
  const pts = Array.from({length:96});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    {pts.map((_,i)=>{
      const a = (i/96)*Math.PI*2;
      const r = 120 + (i%5)*60;
      const x = Math.cos(a + f*0.02)*r;
      const y = Math.sin(a + f*0.02)*r;
      const hue = (i*4 + f)%360;
      return <div key={i} style={{position:'absolute',left:`calc(50% + ${x}px)`,top:`calc(50% + ${y}px)`,width:10,height:10,borderRadius:'50%',background:`hsl(${hue} 80% 60%)`,boxShadow:`0 0 18px hsl(${hue} 80% 60%)`,opacity:.85}}/>;
    })}
  </AbsoluteFill>;
};

const Grid = () => {
  const f = useCurrentFrame();
  const cells = Array.from({length:64});
  return <AbsoluteFill style={{padding:60,display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:12,alignItems:'center'}}>
    {cells.map((_,i)=>{
      const col=i%8,row=Math.floor(i/8);
      const v=interpolate(Math.sin((col+row)*.6+f*.08),[-1,1],[.2,1]);
      const hue=(i*13+f*3)%360;
      return <div key={i} style={{aspectRatio:'1',borderRadius:10,background:`hsl(${hue} 75% 55%)`,opacity:v,transform:`scale(${.5+v*.5})`,boxShadow:`0 0 16px hsl(${hue},75%,55%,.35)`}}/>;
    })}
  </AbsoluteFill>;
};

const Type = () => {
  const f = useCurrentFrame(); const {fps}=useVideoConfig();
  const frases=['VELOCIDADE','PRECISÃO','RITMO','IMPACTO','FLUXO'];
  const idx=Math.floor(f/40)%frases.length;
  const local=f%40;
  const e=spring({frame:local,fps,config:{damping:18,stiffness:150}});
  const x=interpolate(e,[0,1],[-80,0]); const o=interpolate(local,[0,8,32,40],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <h1 style={{margin:0,fontSize:160,letterSpacing:-4,transform:`translateX(${x}px)`,opacity:o,textShadow:'0 0 50px rgba(255,100,200,.6)'}}>{frases[idx]}</h1>
  </AbsoluteFill>;
};

const Equalizer = () => {
  const f=useCurrentFrame();
  const bars=Array.from({length:48});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',gap:6,display:'flex'}}>
    {bars.map((_,i)=>{
      const h=40+Math.abs(Math.sin((i+f*.25)))*260;
      const hue=(i*7+f)%360;
      return <div key={i} style={{width:24,height:h,borderRadius:8,background:`linear-gradient(180deg,hsl(${hue} 80% 60%),hsl(${hue} 80% 35%))`,boxShadow:`0 0 14px hsl(${hue},80%,50%,.4)`}}/>;
    })}
  </AbsoluteFill>;
};

const Spiral = () => {
  const f=useCurrentFrame();
  const pts=Array.from({length:80});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    {pts.map((_,i)=>{
      const a=i*.28+f*.05; const r=i*4+f*.6;
      const x=Math.cos(a)*r; const y=Math.sin(a)*r;
      const hue=(i*5+f*2)%360;
      return <div key={i} style={{position:'absolute',left:`calc(50% + ${x}px)`,top:`calc(50% + ${y}px)`,width:8,height:8,borderRadius:'50%',background:`hsl(${hue} 85% 60%)`,opacity:.9}}/>;
    })}
  </AbsoluteFill>;
};

const Count = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const n=Math.max(0,60-Math.floor(f/3.333));
  const e=spring({frame:f%10,fps,config:{damping:12,stiffness:200}});
  const s=interpolate(e,[0,1],[.7,1.15]);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{fontSize:320,fontWeight:900,transform:`scale(${s})`,textShadow:'0 0 60px rgba(255,200,80,.6)',color:'#fde68a'}}>{n}</div>
  </AbsoluteFill>;
};

const Mosaic = () => {
  const f=useCurrentFrame();
  const cells=Array.from({length:24});
  return <AbsoluteFill style={{padding:40,display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
    {cells.map((_,i)=>{
      const hue=(i*18+f*4)%360;
      const o=interpolate(Math.sin(f*.05+i),[-1,1],[.4,1]);
      return <div key={i} style={{borderRadius:14,background:`linear-gradient(135deg,hsl(${hue} 70% 50%),hsl(${(hue+60)%360} 70% 30%))`,opacity:o,transform:`translateY(${Math.sin(f*.07+i)*8}px)`}}/>;
    })}
  </AbsoluteFill>;
};

const ColorShift = () => {
  const f=useCurrentFrame();
  const t=interpolate(f,[0,200],[0,1],{extrapolateRight:'clamp'});
  const hue=interpolate(t,[0,1],[180,320]);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',background:`linear-gradient(120deg,hsl(${hue} 70% 20%),hsl(${(hue+40)%360} 70% 10%))`}}>
    <h1 style={{margin:0,fontSize:120,letterSpacing:-2,opacity:interpolate(t,[0,.3,1],[0,1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>SHIFT</h1>
  </AbsoluteFill>;
};

const Signature = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const e=spring({frame:f,fps,config:{damping:200}});
  const o=interpolate(e,[0,1],[0,1]);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
    <div style={{opacity:o,transform:`scale(${interpolate(e,[0,1],[.9,1])})`}}>
      <h1 style={{margin:0,fontSize:140,letterSpacing:-3}}>Remotion</h1>
      <p style={{margin:'16px 0 0',fontSize:28,letterSpacing:6,color:'#9bb6ff'}}>ANIMAÇÃO DE 60 SEGUNDOS</p>
    </div>
  </AbsoluteFill>;
};

const Outro = () => {
  const f=useCurrentFrame();
  const o=interpolate(f,[0,30,70],[1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const b=interpolate(f,[0,70],[0,100],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',opacity:o}}>
    <h1 style={{margin:0,fontSize:120}}>FIM</h1>
    <div style={{position:'absolute',bottom:80,width:600,height:8,borderRadius:99,background:'rgba(255,255,255,.12)',overflow:'hidden'}}>
      <div style={{width:`${b}%`,height:'100%',borderRadius:99,background:'linear-gradient(90deg,#4f7cff,#9b6bff,#ff6b9b)'}}/>
    </div>
  </AbsoluteFill>;
};
