The calculator's result display area. Shows a secondary expression line (grey, 12px) above the primary result (white, 36px Outfit Light), both right-aligned over a near-black (#141414) background.

```jsx
// Idle state
<Display value="0" />

// Mid-expression
<Display value="42" expression="6 × 7" />

// After equals
<Display value="42" expression="6 × 7 =" />

// Error state
<Display value="Entrada inválida" expression="1 / 0" />

// With scientific function
<Display value="0.5" expression="sin(30)" angleMode="DEG" />
```

## Notes

- `value` uses `text-overflow: ellipsis` — long numbers clip at the right edge
- `expression` row is always present (renders &nbsp; when empty) to prevent layout shift
- Height is fixed at `--calc-display-h` (72px) — do not use inside a flex-grow container unless you set an explicit height
- Font: Outfit Light 300 for the value, DM Sans 400 for the expression
