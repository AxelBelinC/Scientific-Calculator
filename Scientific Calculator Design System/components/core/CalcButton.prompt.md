A single calculator key with role-based background color matching the original ColorPalette.cs theme. Use in any button grid where calculator-style color-coding by function type is needed.

```jsx
// Basic usage
<CalcButton label="7" role="default" onClick={() => handleDigit('7')} />
<CalcButton label="÷" role="operator" onClick={() => handleOp('/')} />
<CalcButton label="sin" role="scientific" size="sci" onClick={() => handleFn('sin')} />
<CalcButton label="=" role="equals" rowSpan={2} onClick={() => handleEquals()} />
<CalcButton label="0" role="default" colSpan={2} onClick={() => handleDigit('0')} />
<CalcButton label="C" role="utility" size="sci" onClick={() => handleClear()} />
<CalcButton label="MS" role="memory" size="sci" onClick={() => handleMemStore()} />
<CalcButton label="DEG" role="toggle" size="sm" onClick={() => handleToggle()} />
```

## Variants / props

- **role** — 7 roles, each maps to a distinct dark background color. See CalcButton.d.ts for full descriptions.
- **size** — `main` (14px, standard digits/operators), `sci` (10px, scientific/memory row), `sm` (9px bold, mode toggles), `large` (18px, display-adjacent keys)
- **colSpan / rowSpan** — grid-column/row span values for keys that occupy multiple cells (0→colspan 2, =→rowspan 2, +→rowspan 2)
- **disabled** — dims text to #666, blocks pointer events
- **Hover state:** background lightens to `-hover` variant + 1px semi-transparent white border
- **Press state:** all roles darken to #262626 (uniform press feedback)
- **No border radius, no transition** — instant flat color change
