/**
 * Browser entry point for demo bundle
 * Bundles React and ReactDOM with the components (no CDN needed)
 */

// Re-export React and ReactDOM for demo.js to use
export { default as React } from 'react';
export { default as ReactDOM } from 'react-dom/client';

// Re-export everything from the React package index
export * from '../src/react/index';
