Canvas-based function plotter matching the Graficadora window's visual style. Renders f(x) curves over a dark grid with automatic axes, grid lines, and tick labels. Supports pan (drag) and zoom (scroll wheel).

```jsx
// Single function
<GraphView
  functions={[{ expression: 'sin(x)' }]}
  width={600} height={400}
/>

// Multiple functions with explicit colors
<GraphView
  functions={[
    { expression: 'sin(x)',   color: '#00a0ff' },
    { expression: 'cos(x)',   color: '#ff5050' },
    { expression: 'x*x - 4', color: '#50c850' },
  ]}
  xMin={-8} xMax={8}
  yMin={-5} yMax={5}
  angleMode="DEG"
/>

// With range change callback
<GraphView
  functions={fns}
  onRangeChange={({ xMin, xMax, yMin, yMax }) => setRange({ xMin, xMax, yMin, yMax })}
/>
```

## Supported expression syntax

Uses JS `Math.*` in scope. Supported: `sin(x)`, `cos(x)`, `tan(x)`, `asin(x)`, `acos(x)`, `atan(x)`, `log(x)` (base-10), `Math.log(x)` (natural), `sqrt(x)`, `abs(x)`, `pow(x, n)`, `x*x`, `x**2`, arithmetic operators. Angle mode applies to sin/cos/tan/asin/acos/atan.

## Graph palette (auto-assigned in order)
`#00a0ff` → `#ff5050` → `#50c850` → `#ffaa00` → `#b450ff` → `#00dcc8`

## Notes
- Canvas dimensions must be set explicitly — no auto-sizing
- Evaluates 1600 sample points per curve for smooth rendering
- Discontinuities (division, log of negative) are handled by skipping NaN/Infinity
