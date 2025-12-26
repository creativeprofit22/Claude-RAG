/**
 * Claude RAG - Category Storage Helpers
 *
 * File-based storage for document categories and tags.
 * Uses JSON files in the data directory for persistence.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { randomUUID } from 'crypto';
// ============================================
// Configuration
// ============================================
const DATA_DIR = process.env.RAG_DB_PATH || './data';
const CATEGORIES_FILE = join(DATA_DIR, 'categories.json');
const DOC_METADATA_FILE = join(DATA_DIR, 'document-metadata.json');
// Default categories with distinct colors
const BUILTIN_CATEGORIES = [
    { id: 'cat_general', name: 'General', color: '#6b7280', icon: 'folder' },
    { id: 'cat_docs', name: 'Documentation', color: '#3b82f6', icon: 'book' },
    { id: 'cat_code', name: 'Code', color: '#10b981', icon: 'code' },
    { id: 'cat_notes', name: 'Notes', color: '#f59e0b', icon: 'sticky-note' },
];
/**
 * Parse custom categories from RAG_DEFAULT_CATEGORIES env var.
 * Expects JSON array of Category objects. Falls back to built-in if invalid.
 */
function getDefaultCategories() {
    const envCategories = process.env.RAG_DEFAULT_CATEGORIES;
    if (!envCategories) {
        return BUILTIN_CATEGORIES;
    }
    try {
        const parsed = JSON.parse(envCategories);
        if (!Array.isArray(parsed)) {
            console.warn('RAG_DEFAULT_CATEGORIES must be a JSON array, using built-in defaults');
            return BUILTIN_CATEGORIES;
        }
        // Validate each category has required fields
        for (const cat of parsed) {
            if (typeof cat.id !== 'string' || typeof cat.name !== 'string' || typeof cat.color !== 'string') {
                console.warn('Invalid category in RAG_DEFAULT_CATEGORIES, using built-in defaults');
                return BUILTIN_CATEGORIES;
            }
        }
        return parsed;
    }
    catch {
        console.warn('Failed to parse RAG_DEFAULT_CATEGORIES, using built-in defaults');
        return BUILTIN_CATEGORIES;
    }
}
// ============================================
// File I/O Helpers
// ============================================
function ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }
}
/**
 * Generic JSON file reader with fallback
 */
function readJsonStore(path, fallback, errorMessage) {
    try {
        if (existsSync(path)) {
            const data = readFileSync(path, 'utf-8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        const msg = errorMessage || `Error reading ${basename(path)}`;
        console.warn(msg, error instanceof Error ? error.message : error);
    }
    return fallback;
}
/**
 * Generic JSON file writer
 */
function writeJsonStore(path, data) {
    ensureDataDir();
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}
function readCategoryStore() {
    return readJsonStore(CATEGORIES_FILE, { categories: [...getDefaultCategories()], tags: [] }, 'Failed to parse categories file, using defaults. Custom categories may have been lost:');
}
function writeCategoryStore(store) {
    writeJsonStore(CATEGORIES_FILE, store);
}
function readDocMetadataStore() {
    return readJsonStore(DOC_METADATA_FILE, {}, 'Error reading document metadata file:');
}
function writeDocMetadataStore(store) {
    writeJsonStore(DOC_METADATA_FILE, store);
}
/**
 * Remove a reference value from all documents' metadata for a given field.
 * Used by both deleteCategory (categories field) and removeTag (tags field).
 */
function removeReferenceFromAllDocs(field, value) {
    const docStore = readDocMetadataStore();
    let modified = false;
    for (const docId of Object.keys(docStore)) {
        const docMeta = docStore[docId];
        const index = docMeta[field].indexOf(value);
        if (index !== -1) {
            docMeta[field].splice(index, 1);
            modified = true;
        }
    }
    if (modified) {
        writeDocMetadataStore(docStore);
    }
}
// ============================================
// Initialization
// ============================================
/**
 * Initialize category store with defaults if files don't exist
 */
export function initializeCategoryStore() {
    ensureDataDir();
    // Initialize categories file if it doesn't exist
    if (!existsSync(CATEGORIES_FILE)) {
        writeCategoryStore({ categories: [...getDefaultCategories()], tags: [] });
    }
    // Initialize document metadata file if it doesn't exist
    if (!existsSync(DOC_METADATA_FILE)) {
        writeDocMetadataStore({});
    }
}
// ============================================
// Category CRUD
// ============================================
/**
 * Get all categories
 */
export function getCategories() {
    const store = readCategoryStore();
    return store.categories;
}
/**
 * Create a new category
 */
export function createCategory(name, color, icon) {
    const store = readCategoryStore();
    // Generate unique ID using crypto.randomUUID() for guaranteed uniqueness
    const id = `cat_${randomUUID()}`;
    const category = {
        id,
        name: name.trim(),
        color,
        ...(icon && { icon }),
    };
    store.categories.push(category);
    writeCategoryStore(store);
    return category;
}
/**
 * Update an existing category
 */
export function updateCategory(id, updates) {
    const store = readCategoryStore();
    const index = store.categories.findIndex(c => c.id === id);
    if (index === -1) {
        return null;
    }
    // Apply updates immutably
    const category = { ...store.categories[index] };
    if (updates.name !== undefined)
        category.name = updates.name.trim();
    if (updates.color !== undefined)
        category.color = updates.color;
    if (updates.icon !== undefined)
        category.icon = updates.icon;
    store.categories[index] = category;
    writeCategoryStore(store);
    return category;
}
/**
 * Delete a category
 * Also removes the category from all document metadata
 */
export function deleteCategory(id) {
    const store = readCategoryStore();
    const index = store.categories.findIndex(c => c.id === id);
    if (index === -1) {
        return false;
    }
    // Remove category from store
    store.categories.splice(index, 1);
    writeCategoryStore(store);
    // Remove category from all document metadata
    removeReferenceFromAllDocs('categories', id);
    return true;
}
// ============================================
// Document-Category Mappings
// ============================================
/**
 * Get metadata (categories and tags) for a document
 */
export function getDocumentMetadata(documentId) {
    const store = readDocMetadataStore();
    return store[documentId] || { categories: [], tags: [] };
}
/**
 * Set categories for a document
 */
export function setDocumentCategories(documentId, categoryIds) {
    const store = readDocMetadataStore();
    if (!store[documentId]) {
        store[documentId] = { categories: [], tags: [] };
    }
    // Validate category IDs exist
    const categoryStore = readCategoryStore();
    const validIds = new Set(categoryStore.categories.map(c => c.id));
    const filteredIds = categoryIds.filter(id => validIds.has(id));
    // Log if any category IDs were filtered out
    const invalidIds = categoryIds.filter(id => !validIds.has(id));
    if (invalidIds.length > 0) {
        console.warn(`[Categories] Filtered out ${invalidIds.length} invalid category ID(s) for document ${documentId}:`, invalidIds);
    }
    store[documentId].categories = filteredIds;
    writeDocMetadataStore(store);
}
/**
 * Set tags for a document
 */
export function setDocumentTags(documentId, tags) {
    const store = readDocMetadataStore();
    if (!store[documentId]) {
        store[documentId] = { categories: [], tags: [] };
    }
    // Normalize tags (lowercase, trim, unique)
    const normalizedTags = [...new Set(tags.map(t => t.trim().toLowerCase()).filter(t => t.length > 0))];
    store[documentId].tags = normalizedTags;
    // Add any new tags to the global tags list
    const categoryStore = readCategoryStore();
    const existingTags = new Set(categoryStore.tags);
    let tagsModified = false;
    for (const tag of normalizedTags) {
        if (!existingTags.has(tag)) {
            categoryStore.tags.push(tag);
            tagsModified = true;
        }
    }
    if (tagsModified) {
        writeCategoryStore(categoryStore);
    }
    writeDocMetadataStore(store);
}
/**
 * Get document IDs matching a predicate on their metadata.
 * Reduces duplication between category and tag filtering.
 */
function getDocumentsByPredicate(predicate) {
    const store = readDocMetadataStore();
    const documentIds = [];
    for (const [docId, metadata] of Object.entries(store)) {
        if (predicate(metadata)) {
            documentIds.push(docId);
        }
    }
    return documentIds;
}
/**
 * Get all document IDs that have a specific category
 */
export function getDocumentsByCategory(categoryId) {
    return getDocumentsByPredicate((meta) => meta.categories.includes(categoryId));
}
/**
 * Get all document IDs that have a specific tag
 */
export function getDocumentsByTag(tag) {
    const normalizedTag = tag.trim().toLowerCase();
    return getDocumentsByPredicate((meta) => meta.tags.includes(normalizedTag));
}
// ============================================
// Tags
// ============================================
/**
 * Get all known tags
 */
export function getTags() {
    const store = readCategoryStore();
    return store.tags;
}
/**
 * Add a tag to the global tags list
 */
export function addTag(tag) {
    const normalizedTag = tag.trim().toLowerCase();
    if (!normalizedTag)
        return;
    const store = readCategoryStore();
    if (!store.tags.includes(normalizedTag)) {
        store.tags.push(normalizedTag);
        writeCategoryStore(store);
    }
}
/**
 * Remove a tag from the global tags list
 * Also removes the tag from all document metadata
 */
export function removeTag(tag) {
    const normalizedTag = tag.trim().toLowerCase();
    // Remove from global tags
    const categoryStore = readCategoryStore();
    const index = categoryStore.tags.indexOf(normalizedTag);
    if (index !== -1) {
        categoryStore.tags.splice(index, 1);
        writeCategoryStore(categoryStore);
    }
    // Remove from all document metadata
    removeReferenceFromAllDocs('tags', normalizedTag);
}
/**
 * Delete document metadata when a document is deleted
 */
export function deleteDocumentMetadata(documentId) {
    const store = readDocMetadataStore();
    if (store[documentId]) {
        delete store[documentId];
        writeDocMetadataStore(store);
    }
}
//# sourceMappingURL=categories.js.map