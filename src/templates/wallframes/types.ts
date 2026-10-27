export type PhotoVariant =
  | 'suspect'
  | 'scene'
  | 'weapon'
  | 'witness'
  | 'alibi'
  | 'phone'
  | 'card';

export type EvidencePhoto =
  | {kind: 'variant'; variant: PhotoVariant}
  | {kind: 'image'; src: string; fit?: 'cover' | 'contain'; position?: string};

export type EvidenceFrame = {
  id: string;
  x: number;
  y: number;
  code: string;
  title: string;
  photo: EvidencePhoto;
  rotation?: number;
  delay?: number;
};

export type EvidenceLink = {
  from: string;
  to: string;
  bend?: number;
  delay?: number;
};

export type WallFramesProps = {
  caseLabel: string;
  title: string;
  stamp: string;
  footer: string;
  frames: EvidenceFrame[];
  links: EvidenceLink[];
  titleSize?: number;
};
