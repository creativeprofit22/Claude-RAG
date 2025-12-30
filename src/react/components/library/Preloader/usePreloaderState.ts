/**
 * usePreloaderState Hook
 * Library Skin V2: "The Library Opens" Sequence
 *
 * Manages preloader visibility logic:
 * - localStorage flag for auto-skip after first view
 * - prefers-reduced-motion detection
 * - Skip functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEY } from './preloader.types.js';

interface UsePreloaderStateOptions {
  /** Force show preloader regardless of localStorage */
  forceShow?: boolean;
}

interface UsePreloaderStateReturn {
  /** Whether preloader should be displayed */
  shouldShow: boolean;
  /** Whether user has seen preloader before */
  hasSeenBefore: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Mark preloader as seen (sets localStorage flag) */
  markAsSeen: () => void;
  /** Skip remaining animation and complete */
  skipToEnd: () => void;
  /** Whether skip was triggered */
  wasSkipped: boolean;
}

/**
 * Safely checks localStorage for the seen flag
 */
function getHasSeenPreloader(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // localStorage might be blocked
    return false;
  }
}

/**
 * Safely sets localStorage flag
 */
function setPreloaderSeen(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // localStorage might be blocked - fail silently
  }
}

/**
 * Checks if user prefers reduced motion
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function usePreloaderState(
  options: UsePreloaderStateOptions = {}
): UsePreloaderStateReturn {
  const { forceShow = false } = options;

  // Initialize state from storage/media query
  const [hasSeenBefore, setHasSeenBefore] = useState<boolean>(() =>
    getHasSeenPreloader()
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    checkReducedMotion()
  );
  const [wasSkipped, setWasSkipped] = useState(false);

  // Listen for reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Legacy browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Sync with localStorage on mount
  useEffect(() => {
    setHasSeenBefore(getHasSeenPreloader());
  }, []);

  /**
   * Mark preloader as seen - persists to localStorage
   */
  const markAsSeen = useCallback(() => {
    setPreloaderSeen();
    setHasSeenBefore(true);
  }, []);

  /**
   * Skip to end of animation
   */
  const skipToEnd = useCallback(() => {
    setWasSkipped(true);
    markAsSeen();
  }, [markAsSeen]);

  /**
   * Determine if preloader should show based on conditions:
   * - forceShow overrides everything
   * - If hasSeenBefore: don't show (auto-skip)
   * - If prefersReducedMotion: instant fade, brief show
   */
  const shouldShow = useMemo(() => {
    if (forceShow) return true;
    if (hasSeenBefore) return false;
    return true;
  }, [forceShow, hasSeenBefore]);

  return {
    shouldShow,
    hasSeenBefore,
    prefersReducedMotion,
    markAsSeen,
    skipToEnd,
    wasSkipped,
  };
}
