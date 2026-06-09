import React from 'react';

/**
 * HistoryPanel — collapsible sidebar listing past calculations.
 * Mirrors HistoryPanel.cs layout and styling.
 */
export function HistoryPanel({ entries = [], visible = true }) {
  if (!visible) return null;

  const panelStyle = {
    background: 'var(--color-history-bg, #181818)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontFamily: "var(--font-ui, 'DM Sans', 'Segoe UI', sans-serif)",
    fontSize: 'var(--text-hist-title, 11px)',
    fontWeight: 'var(--weight-bold, 700)',
    color: 'var(--color-text-secondary, #a0a0a0)',
    background: 'var(--color-history-bg, #181818)',
    height: 'var(--history-title-height, 36px)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    flexShrink: 0,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    boxSizing: 'border-box',
  };

  const scrollStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#444 transparent',
  };

  const itemStyle = {
    background: 'var(--color-history-item, #242424)',
    padding: '6px 8px',
    minHeight: '52px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    boxSizing: 'border-box',
    flexShrink: 0,
  };

  const exprStyle = {
    fontFamily: "var(--font-ui, 'DM Sans', 'Segoe UI', sans-serif)",
    fontSize: 'var(--text-hist-expr, 10px)',
    fontWeight: 400,
    color: 'var(--color-text-secondary, #a0a0a0)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  };

  const resultStyle = {
    fontFamily: "var(--font-display, 'Outfit', 'Segoe UI Light', sans-serif)",
    fontSize: 'var(--text-hist-result, 13px)',
    fontWeight: 'var(--weight-regular, 400)',
    color: 'var(--color-text-primary, #ffffff)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  };

  const emptyStyle = {
    ...exprStyle,
    textAlign: 'center',
    padding: '24px 12px',
    opacity: 0.5,
  };

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>Historial</div>
      <div style={scrollStyle}>
        {entries.length === 0 ? (
          <div style={emptyStyle}>Sin cálculos aún</div>
        ) : (
          entries.map((entry, i) => (
            <div key={i} style={itemStyle}>
              <div style={exprStyle}>{entry.expression}</div>
              <div style={resultStyle}>= {entry.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
