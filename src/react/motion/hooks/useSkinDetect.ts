import { useState, useEffect } from 'react';
import type { SkinType } from '../types.js';
import { skinMotionMap } from '../variants/index.js';

// Derive valid skins from skinMotionMap to avoid duplication
const VALID_SKINS = Object.keys(skinMotionMap) as SkinType[];

/**
 * Detects current skin from data-skin attribute on document body
 * Uses MutationObserver to react to skin changes
 */
export function useSkinDetect(): SkinType {
  const [skin, setSkin] = useState<SkinType>('library');

  useEffect(() => {
    const detectSkin = () => {
      const attr = document.body.getAttribute('data-skin');
      if (attr && VALID_SKINS.includes(attr as SkinType)) {
        setSkin(attr as SkinType);
      }
    };

    // Initial detection
    detectSkin();

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-skin') {
          detectSkin();
        }
      }
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return skin;
}
