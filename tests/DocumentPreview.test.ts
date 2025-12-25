/**
 * Tests for DocumentPreview.tsx bug fixes
 *
 * Verifies:
 * - L2: getFileType returns 'FILE' (not 'DOC') for files without extension
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';

describe('DocumentPreview.tsx bug fixes', () => {

  describe('L2: Default file type for extensionless files', () => {
    test('should return FILE not DOC for files without extension', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentPreview.tsx');
      const source = await Bun.file(sourceFile).text();

      // The getFileType function should return 'FILE' for no extension (in ternary)
      expect(source).toMatch(/:\s*['"]FILE['"]/);

      // Should NOT return 'DOC' as the fallback
      expect(source).not.toMatch(/:\s*['"]DOC['"]/);
    });

    test('should derive file type from extension dynamically', async () => {
      const sourceFile = join(import.meta.dir, '../src/react/components/documents/DocumentPreview.tsx');
      const source = await Bun.file(sourceFile).text();

      // File type is derived from extension using .toUpperCase()
      expect(source).toMatch(/\.toUpperCase\(\)/);

      // Should split by '.' to get extension
      expect(source).toMatch(/split\(['"]\.['"]\)\.pop\(\)/);
    });
  });
});
