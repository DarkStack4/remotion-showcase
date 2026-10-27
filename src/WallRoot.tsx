import React from 'react';
import {Composition} from 'remotion';
import {WallFrames, crimeSceneProps, moneyTrailProps} from './templates/wallframes';

export const WallRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WallFrames"
        component={WallFrames}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={crimeSceneProps}
      />
      <Composition
        id="WallFramesMoney"
        component={WallFrames}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={moneyTrailProps}
      />
    </>
  );
};
