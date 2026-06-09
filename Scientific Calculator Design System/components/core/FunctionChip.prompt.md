A pill chip in the grapher toolbar representing one plotted function. Shows a colored dot (matching the plot line), the expression, and an optional remove button.

```jsx
// Basic chip with remove
<FunctionChip
  expression="sin(x)"
  color="var(--color-plot-1)"
  onRemove={() => removeFunction(0)}
/>

// Second function, different color
<FunctionChip
  expression="x^2 - 4"
  color="var(--color-plot-2)"
  onRemove={() => removeFunction(1)}
/>

// Display-only (no remove)
<FunctionChip expression="cos(x)" color="var(--color-plot-3)" />
```

Color values should come from the `--color-plot-N` tokens (1–6) which cycle automatically in the grapher engine.
