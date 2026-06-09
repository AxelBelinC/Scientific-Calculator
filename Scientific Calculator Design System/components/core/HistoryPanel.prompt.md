The calculation history sidebar. Shows past expression + result pairs in a scrollable list, most recent at top. Each row is right-aligned, two-line: expression in muted grey (10px) above result in white (13px). Background is #181818, items #242424.

```jsx
<HistoryPanel
  entries={[
    { expression: 'sin(30)', result: '0.5' },
    { expression: '6 × 7',  result: '42' },
    { expression: '√(144)', result: '12' },
  ]}
/>

// Hidden (collapsed via Hist toggle)
<HistoryPanel entries={history} visible={false} />

// Empty state
<HistoryPanel entries={[]} />
```

## Notes

- Always render in a container with explicit height — it uses `flex: 1` + `overflow-y: auto` internally
- `entries` should be ordered most-recent-first (engine inserts at index 0)
- Max 20 entries enforced by the calculator engine — the component itself has no limit
- Empty state shows "Sin cálculos aún" centered in the scroll area
