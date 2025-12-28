import type { SkinMotionMap } from '../types.js';
import { libraryMotion } from './library.js';
import { cyberpunkMotion } from './cyberpunk.js';
import { brutalistMotion } from './brutalist.js';
import { glassMotion } from './glass.js';

// Export individual skin configs
export { libraryMotion } from './library.js';
export { cyberpunkMotion } from './cyberpunk.js';
export { brutalistMotion } from './brutalist.js';
export { glassMotion } from './glass.js';

// Combined map for skin lookup
export const skinMotionMap: SkinMotionMap = {
  library: libraryMotion,
  cyberpunk: cyberpunkMotion,
  brutalist: brutalistMotion,
  glass: glassMotion,
};
