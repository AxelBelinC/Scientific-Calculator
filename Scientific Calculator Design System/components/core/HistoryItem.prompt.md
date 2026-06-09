A single row in the calculation history panel. Shows expression above in secondary text and result below in primary text, right-aligned.

```jsx
<HistoryItem
  expression="sin(45) × 2"
  result="1.41421356"
  onClick={() => recallResult('1.41421356')}
/>

// Non-interactive (display-only)
<HistoryItem expression="3 ^ 4" result="81" />
```

Renders with dark background, hover lightens background slightly. Typically rendered inside a scrollable column, newest at top.
