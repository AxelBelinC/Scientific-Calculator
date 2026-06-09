import React from 'react';

/**
 * Display — the calculator result + expression area.
 * Mirrors Form1.cs BuildDisplayLabel + BuildExpressionLabel.
 */
export function Display({ value = '0', expression = '', angleMode = 'DEG' }) {
  const containerStyle = {
    background: 'var(--color-display-bg, #141414)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    height: 'var(--calc-display-h, 72px)',
    boxSizing: 'border-box',
    paddingRight: 'var(--display-pad-r, 10px)',
    paddingBottom: '6px',
    overflow: 'hidden',
  };

  const exprStyle = {
    fontFamily: "var(--font-ui, 'DM Sans', 'Segoe UI', sans-serif)",
    fontSize: 'var(--text-expression, 12px)',
    fontWeight: 400,
    color: 'var(--color-text-secondary, #a0a0a0)',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    minHeight: '16px',
  };

  const valueStyle = {
    fontFamily: "var(--font-display, 'Outfit', 'Segoe UI Light', sans-serif)",
    fontSize: 'var(--text-display, 36px)',
    fontWeight: 'var(--weight-light, 300)',
    color: 'var(--color-text-primary, #ffffff)',
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  };

  return (
    <div style={containerStyle}>
      <div style={exprStyle}>{expression || '\u00a0'}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}
