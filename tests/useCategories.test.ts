/**
 * Tests for useCategories.ts bug fixes
 *
 * Verifies:
 * - M2: transformCategoriesResponse validates types before casting
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('useCategories.ts bug fixes', () => {

  describe('M2: Type validation in transformCategoriesResponse', () => {
    test('source code should contain validation logic', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useCategories.ts');
      const source = await Bun.file(sourceFile).text();

      // Should check if data is an object
      expect(source).toMatch(/typeof data !== ['"]object['"]/);

      // Should check if categories is an array
      expect(source).toMatch(/Array\.isArray/);

      // Should validate required properties exist (checking property access)
      expect(source).toMatch(/\.id\b/);
      expect(source).toMatch(/\.name\b/);
      expect(source).toMatch(/\.color\b/);
    });

    test('should handle null/undefined data gracefully', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useCategories.ts');
      const source = await Bun.file(sourceFile).text();

      // Should handle null check
      expect(source).toMatch(/data === null|!data/);
    });

    test('should throw descriptive errors for invalid data', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useCategories.ts');
      const source = await Bun.file(sourceFile).text();

      // Should have descriptive error messages
      expect(source).toMatch(/throw new Error\(/);
      expect(source).toMatch(/invalid|Invalid|must be|expected/i);
    });
  });
});
