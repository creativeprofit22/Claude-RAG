/**
 * Tests for DocumentSearch.tsx bug fixes
 *
 * Verifies:
 * - M3: Debounce effect doesn't have 'value' in dependency array
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('DocumentSearch.tsx bug fixes', () => {

  describe('M3: Debounce effect dependency array', () => {
    test('debounce useEffect should not include value prop in deps', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentSearch.tsx');
      const source = await Bun.file(sourceFile).text();

      // Find the debounce useEffect - it should have setTimeout
      const debounceEffectMatch = source.match(/useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?setTimeout[\s\S]*?\},\s*\[([^\]]*)\]\s*\)/);

      expect(debounceEffectMatch).not.toBeNull();

      if (debounceEffectMatch) {
        const deps = debounceEffectMatch[1];

        // Should include localValue (or similar local state)
        expect(deps).toMatch(/localValue|searchValue|inputValue/);

        // Should NOT include 'value' as a standalone dependency
        // (value in valueRef is ok, but not value alone)
        const depsArray = deps.split(',').map(d => d.trim());
        const hasStandaloneValue = depsArray.some(d => d === 'value');
        expect(hasStandaloneValue).toBe(false);
      }
    });

    test('should use ref to track value prop changes', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentSearch.tsx');
      const source = await Bun.file(sourceFile).text();

      // Should use useRef for value prop
      expect(source).toMatch(/useRef.*value|valueRef/);
    });
  });
});
