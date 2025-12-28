# ECharts Skin Themes Plan
## Claude-RAG - Skin-Aware Chart Theming

**Created:** 2025-12-28
**Status:** Ready for implementation

---

## 1. Package Setup

```bash
npm install echarts echarts-for-react
npm install -D @types/echarts-for-react
```

---

## 2. File Structure

```
src/react/charts/
├── index.ts                    # Public exports
├── SkinAwareChart.tsx          # Wrapper component
├── themes/
│   ├── index.ts                # Theme registry & utilities
│   ├── library.ts              # Victorian theme
│   ├── cyberpunk.ts            # Neon theme
│   ├── brutalist.ts            # Bauhaus theme
│   ├── glass.ts                # Morphism theme
│   └── types.ts                # Theme type definitions
├── hooks/
│   ├── useSkinTheme.ts         # Skin detection
│   └── useChartTheme.ts        # Theme provider
└── components/
    ├── CategoryBarChart.tsx    # Document categories
    └── StatGauge.tsx           # Metric visualization
```

---

## 3. Theme Type Definitions

```typescript
export type SkinName = 'library' | 'cyberpunk' | 'brutalist' | 'glass';

export interface SkinChartTheme {
  theme: EChartsOption;
  name: string;
  seriesEnhancements: {
    bar?: { itemStyle?: any; emphasis?: any };
    line?: { lineStyle?: any; areaStyle?: any };
  };
  animation: {
    animationDuration: number;
    animationEasing: string;
    animationDelay?: number | ((idx: number) => number);
  };
}
```

---

## 4. Theme Summaries

### Library Theme
- **Palette:** Brass (#B87333), amber, cream, saddle brown
- **Typography:** Playfair Display (serif)
- **Bars:** Embossed gradient, 2px offset shadow
- **Tooltip:** Parchment style, corner decoration
- **Animation:** 800ms, cubicOut, stagger 50ms

### Cyberpunk Theme
- **Palette:** Cyan (#00ffff), magenta (#ff0080), neon accents
- **Typography:** Orbitron, Share Tech Mono
- **Bars:** Neon gradient, shadowBlur: 15-30
- **Tooltip:** Holographic panel, angular clip-path
- **Animation:** 600ms, elasticOut, stagger 30ms

### Brutalist Theme
- **Palette:** Primary only (red, blue, yellow, black)
- **Typography:** Space Grotesk, Space Mono
- **Bars:** Solid fill, 3px black border, 4px offset shadow
- **Tooltip:** Bold box, thick border, offset shadow
- **Animation:** 400ms, cubicOut, no stagger

### Glass Theme
- **Palette:** Purple (#8a2be2), cyan (#06b6d4), gradients
- **Typography:** Inter
- **Bars:** Gradient fill, rounded corners, soft glow
- **Tooltip:** Frosted glass, backdrop-blur
- **Animation:** 1000ms, cubicInOut, stagger 80ms

---

## 5. CSS Variable Integration

```typescript
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

// Theme creation reads CSS vars at runtime
const primary = getCSSVariable('--skin-primary') || '#B87333';
```

---

## 6. SkinAwareChart Component

```typescript
export const SkinAwareChart = forwardRef<SkinAwareChartRef, SkinAwareChartProps>(
  function SkinAwareChart({
    option,
    chartType = 'bar',
    applySkinEnhancements = true,
    height = 300,
    loading = false,
    ...props
  }, ref) {
    const { themeName, theme, skin } = useChartTheme();

    const enhancedOption = useMemo(() => {
      if (!applySkinEnhancements) return option;

      // Merge series with skin enhancements
      const enhancements = theme.seriesEnhancements[chartType];
      // ... deep merge logic

      return {
        ...option,
        series,
        animationDuration: theme.animation.animationDuration,
        animationEasing: theme.animation.animationEasing,
      };
    }, [option, theme, chartType]);

    return (
      <ReactEChartsCore
        echarts={echarts}
        option={enhancedOption}
        theme={themeName}
        style={{ height, width: '100%' }}
        showLoading={loading}
        {...props}
      />
    );
  }
);
```

---

## 7. Dynamic Theme Switching

```typescript
export function useChartTheme() {
  const skin = useSkinTheme(); // MutationObserver on data-skin

  const theme = useMemo(() => {
    const creator = themeCreators[skin];
    return creator();
  }, [skin]);

  useEffect(() => {
    // Re-register theme when skin changes
    echarts.registerTheme(`skin-${skin}`, theme.theme);
  }, [skin, theme]);

  return { themeName: `skin-${skin}`, theme, skin };
}
```

---

## 8. Series-Level Glow Effects

Glow effects (shadowBlur, shadowColor) must be applied at series level:

```typescript
// Cyberpunk bar series
seriesEnhancements: {
  bar: {
    itemStyle: {
      color: { type: 'linear', colorStops: [...] },
      shadowBlur: 15,
      shadowColor: 'rgba(0, 255, 255, 0.4)',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 30,
        shadowColor: '#00ffff',
      },
    },
  },
}
```

---

## 9. CategoryBarChart Implementation

```typescript
export function CategoryBarChart({ data, height = 200, onCategoryClick }) {
  const option = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.categoryName),
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      type: 'bar',
      data: data.map(d => ({
        value: d.count,
        itemStyle: { color: d.color },
      })),
    }],
  }), [data]);

  return (
    <SkinAwareChart
      option={option}
      chartType="bar"
      height={height}
      onEvents={{ click: handleClick }}
    />
  );
}
```

---

## 10. AdminDashboard Integration

Replace current CSS bars with ECharts:

```tsx
// Before: Custom CSS bars
<div className="rag-admin-bar-chart">
  {data.map(item => <div className="rag-admin-bar-fill" />)}
</div>

// After: ECharts
<CategoryBarChart
  data={stats?.documents.byCategory || []}
  height={200}
/>
```

---

## Key Files

- `/home/reaver47/Documents/Claude-RAG/demo/skins.css` - CSS variable source
- `/home/reaver47/Documents/Claude-RAG/src/react/components/admin/AdminDashboard.tsx` - Integration target
