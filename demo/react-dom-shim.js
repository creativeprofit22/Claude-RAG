/**
 * ReactDOM shim for browser bundle
 * Re-exports from bundled ReactDOM (no CDN needed)
 * Includes client APIs for React 18+
 */

import ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';

// Re-export all ReactDOM APIs
export default ReactDOM;

// React 18 client APIs
export { createRoot, hydrateRoot };

// Legacy APIs
export const render = ReactDOM.render;
export const hydrate = ReactDOM.hydrate;
export const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
export const findDOMNode = ReactDOM.findDOMNode;
export const createPortal = ReactDOM.createPortal;
export const flushSync = ReactDOM.flushSync;
export const unstable_batchedUpdates = ReactDOM.unstable_batchedUpdates;
