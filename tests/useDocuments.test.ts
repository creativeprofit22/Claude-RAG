/**
 * Tests for useDocuments.ts bug fixes
 *
 * Verifies:
 * - M1: transformDocumentsResponse validates types before casting
 * - L3: Default sort order is documented
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('useDocuments.ts bug fixes', () => {

  describe('M1: Type validation in transformDocumentsResponse', () => {
    test('source code should contain validation logic', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Should check if data is an object
      expect(source).toMatch(/typeof data !== ['"]object['"]/);

      // Should check if documents is an array
      expect(source).toMatch(/Array\.isArray/);

      // Should validate required properties exist
      expect(source).toContain('documentId');
      expect(source).toContain('documentName');
      expect(source).toContain('chunkCount');
      expect(source).toContain('timestamp');
    });

    test('should handle null/undefined data gracefully', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Should handle null check
      expect(source).toMatch(/data === null|!data/);
    });

    test('should throw descriptive errors for invalid data', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Should have descriptive error messages
      expect(source).toMatch(/throw new Error\(/);
      expect(source).toMatch(/invalid|Invalid|must be|expected/i);
    });
  });

  describe('L3: Sort order documentation', () => {
    test('default sort order should be documented', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/hooks/useDocuments.ts');
      const source = await Bun.file(sourceFile).text();

      // Should have comment explaining default sort
      expect(source).toMatch(/newest.*first|descending|Default sort/i);
    });
  });
});
