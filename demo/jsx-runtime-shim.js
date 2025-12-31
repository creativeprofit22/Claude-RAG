/**
 * JSX Runtime shim for browser bundle
 * Uses bundled React (no CDN needed)
 */

import React from 'react';

export function jsx(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) {
    rest.key = key;
  }
  if (children !== undefined) {
    if (Array.isArray(children)) {
      return React.createElement(type, rest, ...children);
    }
    return React.createElement(type, rest, children);
  }
  return React.createElement(type, rest);
}

export function jsxs(type, props, key) {
  return jsx(type, props, key);
}

export const Fragment = React.Fragment;
