import gsap from 'gsap';

let initialized = false;

/**
 * Initialize GSAP with default configuration
 * Safe to call multiple times - only initializes once
 */
export function initGSAP(): void {
  if (initialized || typeof window === 'undefined') return;

  // Configure GSAP defaults
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.3,
  });

  // Set global config
  gsap.config({
    nullTargetWarn: false, // Suppress warnings for null targets (common in React)
    force3D: true, // Force GPU acceleration
  });

  initialized = true;
}

export { gsap };
