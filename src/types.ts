export type EffectType = 'none' | 'snowflakes' | 'balloons';

export interface Particle {
  id: string;
  x: number;          // horizontal start position (0 - 100 representing percentage)
  y: number;          // current vertical position (percentage or pixels)
  size: number;       // diameter in pixels
  speed: number;      // drift/fall speed
  swaySpeed: number;  // horizontal waving frequency
  swayAmp: number;    // horizontal waving extent (amplitude)
  opacity: number;    // individual material opacity
  color?: string;     // specific colors (used for balloons)
  wiggleOffset: number; // random phase shift
}
