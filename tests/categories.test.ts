/**
 * Tests for categories.ts bug fixes
 *
 * Verifies:
 * - M4: Category IDs use crypto.randomUUID() (collision-proof)
 * - L4: Warning messages don't expose full paths
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('categories.ts bug fixes', () => {

  describe('M4: Category ID uniqueness', () => {
    test('category IDs should use UUID format (collision-proof)', async () => {
      // Read the source to verify UUID usage
      const sourceFile = join(import.meta.dir, '../src/categories.ts');
      const source = await Bun.file(sourceFile).text();

      // Verify randomUUID is imported
      expect(source).toContain("import { randomUUID } from 'crypto'");

      // Verify category ID uses randomUUID
      expect(source).toMatch(/cat_\$\{randomUUID\(\)\}/);

      // Verify old Date.now() pattern is NOT used for category IDs
      expect(source).not.toMatch(/cat_\$\{Date\.now\(\)\}/);
    });

    test('generated category IDs should be unique', async () => {
      const { createCategory, deleteCategory } = await import('../src/categories');

      // Create multiple categories rapidly
      const ids: string[] = [];
      for (let i = 0; i < 10; i++) {
        const category = createCategory(`Test Category ${i}`, '#ff0000');
        ids.push(category.id);
        deleteCategory(category.id); // Cleanup
      }

      // All IDs should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      // All IDs should start with 'cat_' and contain UUID format
      for (const id of ids) {
        expect(id).toMatch(/^cat_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      }
    });
  });

  describe('L4: Path sanitization in warnings', () => {
    test('warning messages should not expose full file paths', async () => {
      const sourceFile = join(import.meta.dir, '../src/categories.ts');
      const source = await Bun.file(sourceFile).text();

      // Verify basename is imported
      expect(source).toContain('basename');

      // Verify error messages use basename(path) not raw path
      expect(source).toMatch(/Error reading \$\{basename\(path\)\}/);

      // Should NOT have raw path in error messages
      expect(source).not.toMatch(/Error reading \$\{path\}[^)]/);
    });
  });
});
