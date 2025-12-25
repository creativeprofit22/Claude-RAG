/**
 * Tests for DocumentCard.tsx bug fixes
 *
 * Verifies:
 * - L1: Keyboard handler includes Escape key to blur
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('DocumentCard.tsx bug fixes', () => {

  describe('L1: Escape key handling for accessibility', () => {
    test('keyboard handler should handle Escape key', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentCard.tsx');
      const source = await Bun.file(sourceFile).text();

      // Should check for Escape key
      expect(source).toMatch(/['"]Escape['"]/);

      // Should call blur() when Escape is pressed
      expect(source).toMatch(/\.blur\(\)/);

      // The Escape handling should be in the keyboard handler
      expect(source).toMatch(/e\.key\s*===\s*['"]Escape['"]|key\s*===\s*['"]Escape['"]/);
    });

    test('should also handle Enter and Space keys', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentCard.tsx');
      const source = await Bun.file(sourceFile).text();

      // Should handle Enter key (for activation)
      expect(source).toMatch(/['"]Enter['"]/);

      // Should handle Space key (for activation) - may be ' ' or 'Space'
      expect(source).toMatch(/['"]\s+['"]|['"]Space['"]/);
    });
  });
});
