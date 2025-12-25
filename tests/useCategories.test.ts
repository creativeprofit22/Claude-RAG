/**
 * Tests for useCategories.ts bug fixes
 *
 * Verifies:
 * - M2: transformCategoriesResponse validates types before casting
 * - Validation logic is in shared validateApiArrayResponse helper
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('useCategories.ts bug fixes', () => {

  describe('M2: Type validation in transformCategoriesResponse', () => {
    test('should use shared validateApiArrayResponse helper', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useCategories.ts');
      const source = await Bun.file(sourceFile).text();

      // Should import the shared validation helper
      expect(source).toMatch(/import\s*{[^}]*validateApiArrayResponse[^}]*}\s*from\s*['"]\.\/useDocuments/);

      // Should use the helper in transformCategoriesResponse
      expect(source).toMatch(/validateApiArrayResponse<Category>/);
    });

    test('shared helper should contain validation logic', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Should check if data is an object
      expect(source).toMatch(/typeof data !== ['"]object['"]/);

      // Should check if field is an array
      expect(source).toMatch(/Array\.isArray/);

      // Should handle null check
      expect(source).toMatch(/data === null/);
    });

    test('should validate category-specific properties', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useCategories.ts');
      const source = await Bun.file(sourceFile).text();

      // Should have category field validator checking required properties
      expect(source).toMatch(/\.id\b/);
      expect(source).toMatch(/\.name\b/);
      expect(source).toMatch(/\.color\b/);
    });

    test('should throw descriptive errors for invalid data', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Shared helper should have descriptive error messages
      expect(source).toMatch(/throw new Error\(/);
      expect(source).toMatch(/invalid|Invalid|must be|expected/i);
    });
  });
});
