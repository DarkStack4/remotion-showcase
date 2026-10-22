export const C = {
  bg0: '#03050b',
  bg1: '#070c18',
  ink: '#eef4ff',
  dim: 'rgba(238,244,255,0.52)',
  faint: 'rgba(238,244,255,0.16)',
  cyan: '#54e6ff',
  blue: '#3d6bff',
  violet: '#9a5cff',
  pink: '#ff4d9d',
  amber: '#ffc861',
};

export const FONT = 'Arial, "Helvetica Neue", "Liberation Sans", sans-serif';
export const MONO = '"Courier New", Consolas, "Liberation Mono", monospace';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const rand = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
