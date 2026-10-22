import React from 'react';
import {Composition} from 'remotion';
import {Hello} from './Hello';
import {Showcase} from './Showcase';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Hello"
        component={Hello}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
