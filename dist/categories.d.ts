/**
 * Claude RAG - Category Storage Helpers
 *
 * File-based storage for document categories and tags.
 * Uses JSON files in the data directory for persistence.
 */
export interface Category {
    id: string;
    name: string;
    color: string;
    icon?: string;
}
export interface CategoryStore {
    categories: Category[];
    tags: string[];
}
export interface DocumentMetadataStore {
    [documentId: string]: {
        categories: string[];
        tags: string[];
    };
}
/**
 * Initialize category store with defaults if files don't exist
 */
export declare function initializeCategoryStore(): void;
/**
 * Get all categories
 */
export declare function getCategories(): Category[];
/**
 * Create a new category
 */
export declare function createCategory(name: string, color: string, icon?: string): Category;
/**
 * Update an existing category
 */
export declare function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Category | null;
/**
 * Delete a category
 * Also removes the category from all document metadata
 */
export declare function deleteCategory(id: string): boolean;
/**
 * Get metadata (categories and tags) for a document
 */
export declare function getDocumentMetadata(documentId: string): {
    categories: string[];
    tags: string[];
};
/**
 * Set categories for a document
 */
export declare function setDocumentCategories(documentId: string, categoryIds: string[]): void;
/**
 * Set tags for a document
 */
export declare function setDocumentTags(documentId: string, tags: string[]): void;
/**
 * Get all document IDs that have a specific category
 */
export declare function getDocumentsByCategory(categoryId: string): string[];
/**
 * Get all document IDs that have a specific tag
 */
export declare function getDocumentsByTag(tag: string): string[];
/**
 * Get all known tags
 */
export declare function getTags(): string[];
/**
 * Add a tag to the global tags list
 */
export declare function addTag(tag: string): void;
/**
 * Remove a tag from the global tags list
 * Also removes the tag from all document metadata
 */
export declare function removeTag(tag: string): void;
/**
 * Delete document metadata when a document is deleted
 */
export declare function deleteDocumentMetadata(documentId: string): void;
//# sourceMappingURL=categories.d.ts.map