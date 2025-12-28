# Tailwind CSS Hybrid Integration Plan
## Claude-RAG - Utility Layer (Not Design System)

**Created:** 2025-12-28
**Status:** Ready for implementation

---

## Philosophy

**Tailwind = Utility layer for layout/spacing**
**Existing CSS = Personality (shapes, textures, shadows)**

We're NOT replacing the skin system. We're adding Tailwind for:
- Flexbox/grid layout
- Spacing utilities
- Responsive breakpoints
- Basic positioning

---

## 1. Package Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npm install clsx tailwind-merge
```

---

## 2. File Structure

```
/home/reaver47/Documents/Claude-RAG/
├── postcss.config.mjs          # PostCSS config
├── tailwind.config.ts          # Tailwind config
└── src/react/
    ├── utils/
    │   └── cn.ts               # Class merge utility
    └── styles.css              # Add @tailwind directives
```

---

## 3. tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/react/**/*.{ts,tsx}',
    './demo/**/*.{html,tsx}',
  ],

  theme: {
    extend: {
      // Map curator tokens to Tailwind
      colors: {
        'curator-deep': 'var(--curator-bg-deep)',
        'curator-surface': 'var(--curator-bg-surface)',
        'curator-hover': 'var(--curator-bg-hover)',
        'curator-text': 'var(--curator-text-primary)',
        'curator-text-secondary': 'var(--curator-text-secondary)',
        'curator-gold': 'var(--curator-gold)',
        'curator-border': 'var(--curator-border-light)',
        'curator-success': 'var(--curator-success)',
        'curator-error': 'var(--curator-error)',
      },

      spacing: {
        'curator-xs': 'var(--curator-space-1)',
        'curator-sm': 'var(--curator-space-2)',
        'curator-md': 'var(--curator-space-3)',
        'curator-lg': 'var(--curator-space-4)',
        'curator-xl': 'var(--curator-space-6)',
      },

      borderRadius: {
        'curator-sm': 'var(--curator-radius-sm)',
        'curator-md': 'var(--curator-radius-md)',
        'curator-lg': 'var(--curator-radius-lg)',
        'curator-xl': 'var(--curator-radius-xl)',
      },

      fontFamily: {
        'curator-serif': 'var(--curator-font-serif)',
        'curator-sans': 'var(--curator-font-sans)',
        'curator-mono': 'var(--curator-font-mono)',
      },

      boxShadow: {
        'curator-sm': 'var(--curator-shadow-sm)',
        'curator-md': 'var(--curator-shadow-md)',
        'curator-lg': 'var(--curator-shadow-lg)',
      },

      transitionDuration: {
        'curator-fast': 'var(--curator-duration-fast)',
        'curator-normal': 'var(--curator-duration-normal)',
      },
    },
  },

  plugins: [],
};

export default config;
```

---

## 4. cn() Utility

```typescript
// src/react/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## 5. CSS Processing Order

```css
/* styles.css */

/* 1. Tailwind reset */
@tailwind base;

/* 2. Curator tokens */
@import './tokens/index.css';

/* 3. Tailwind components (rarely used) */
@tailwind components;

/* 4. Existing rag-* and curator-* styles */
/* ... all existing CSS ... */

/* 5. Tailwind utilities (last = highest priority for overrides) */
@tailwind utilities;
```

---

## 6. When to Use What

| Use Case | Tailwind | Custom CSS |
|----------|----------|------------|
| Flexbox layout | `flex items-center gap-4` | - |
| Grid | `grid grid-cols-3` | - |
| Spacing | `p-4 mt-2 gap-curator-md` | - |
| Responsive | `md:flex-row lg:grid-cols-4` | - |
| Positioning | `relative absolute fixed` | - |
| **Clip-paths** | - | `clip-path: var(--skin-card-clip)` |
| **Textures** | - | `background: var(--skin-texture-overlay)` |
| **Skin shadows** | - | `box-shadow: var(--skin-shadow-brutal)` |
| **Gradients** | - | `background: var(--skin-gradient-btn)` |
| **Animations** | - | `@keyframes curator-*` |

---

## 7. Usage Pattern with Motion

```tsx
import { motion } from 'framer-motion';
import { cn } from '../utils/cn.js';

function AnimatedCard({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        // Tailwind for layout
        'flex flex-col gap-curator-md p-curator-lg',
        // Custom class for skin styling
        'rag-doc-card',
        // Allow override
        className
      )}
    >
      {children}
    </motion.div>
  );
}
```

---

## 8. Anti-Patterns to AVOID

### DON'T replace skin styling
```tsx
// BAD
<button className="bg-blue-500 hover:bg-blue-600 rounded-lg">

// GOOD
<button className={cn('curator-btn curator-btn-primary', 'flex items-center gap-2')}>
```

### DON'T override clip-paths
```tsx
// BAD - ruins cyberpunk angular cuts
<div className="rag-doc-card rounded-2xl">

// GOOD - let skin control shape
<div className="rag-doc-card">
```

### DON'T use Tailwind colors for themed elements
```tsx
// BAD
<span className="text-amber-500">

// GOOD
<span className="text-curator-gold">
```

---

## 9. Build Integration

### postcss.config.mjs
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### package.json scripts
```json
{
  "scripts": {
    "build": "npm run build:css && tsc && npm run copy-assets",
    "build:css": "postcss src/react/styles.css -o dist/react/styles.css",
    "dev:css": "postcss src/react/styles.css -o dist/react/styles.css --watch"
  }
}
```

---

## 10. Migration Approach

1. **DO NOT rewrite existing CSS** - it works
2. Use Tailwind for NEW components (motion wrappers, chart containers)
3. Add Tailwind utilities alongside existing classes where helpful
4. Gradual adoption, not big-bang migration

---

## Key Files

- `/home/reaver47/Documents/Claude-RAG/src/react/tokens/colors.css` - Color tokens
- `/home/reaver47/Documents/Claude-RAG/src/react/tokens/spacing.css` - Spacing tokens
- `/home/reaver47/Documents/Claude-RAG/src/react/styles.css` - Add @tailwind directives
