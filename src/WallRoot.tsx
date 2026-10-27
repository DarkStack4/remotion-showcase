import React from 'react';
import {Composition} from 'remotion';
import {WallFrames} from './WallFrames';

export const WallRoot: React.FC = () => {
  return (
    <Composition
      id="WallFrames"
      component={WallFrames}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
