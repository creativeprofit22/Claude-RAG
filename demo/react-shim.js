/**
 * React shim for browser bundle
 * Maps to global window.React from CDN
 */

const React = window.React;

// Re-export all commonly used React APIs
export default React;
export const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useInsertionEffect,
  createContext,
  createElement,
  cloneElement,
  isValidElement,
  Children,
  Fragment,
  StrictMode,
  Suspense,
  lazy,
  memo,
  forwardRef,
  createRef,
  Component,
  PureComponent,
} = React;
