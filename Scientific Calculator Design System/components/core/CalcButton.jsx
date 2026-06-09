import React from 'react';

/**
 * CalcButton — a single calculator key with role-based color coding.
 * Supports 7 roles matching the original ColorPalette.cs definitions.
 */
export function CalcButton({
  label,
  role = 'default',
  onClick,
  disabled = false,
  colSpan = 1,
  rowSpan = 1,
  size = 'main',
  style: extraStyle = {},
}) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const colorMap = {
    default:    { base: '#323232', hover: '#444444' },
    operator:   { base: '#2d3749', hover: '#3c4b64' },
    scientific: { base: '#263241', hover: '#344458' },
    equals:     { base: '#0067c0', hover: '#0078d7' },
    memory:     { base: '#32263c', hover: '#443452' },
    utility:    { base: '#3e2828', hover: '#553737' },
    toggle:     { base: '#263241', hover: '#344458' },
  };

  const sizeMap = {
    main:  { fontSize: 'var(--text-btn-main, 14px)',  fontWeight: 400 },
    sci:   { fontSize: 'var(--text-btn-sci,  10px)',  fontWeight: 400 },
    sm:    { fontSize: 'var(--text-btn-sm,    9px)',  fontWeight: 700 },
    large: { fontSize: '18px',                        fontWeight: 300 },
  };

  const c = colorMap[role] || colorMap.default;
  const s = sizeMap[size]  || sizeMap.main;

  const bg = pressed && !disabled
    ? '#262626'
    : hovered && !disabled
      ? c.hover
      : c.base;

  const border = hovered && !disabled
    ? '1px solid rgba(255,255,255,0.31)'
    : '1px solid transparent';

  const btnStyle = {
    background: bg,
    border,
    borderRadius: 0,
    color: disabled ? '#666' : '#fff',
    fontFamily: "var(--font-ui, 'DM Sans', 'Segoe UI', sans-serif)",
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    cursor: disabled ? 'not-allowed' : 'pointer',
    gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
    gridRow:    rowSpan > 1 ? `span ${rowSpan}` : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    outline: 'none',
    padding: 0,
    margin: 0,
    minWidth: 0,
    minHeight: 0,
    lineHeight: 1,
    transition: 'none',
    boxSizing: 'border-box',
    ...extraStyle,
  };

  return (
    <button
      style={btnStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
      aria-label={label}
    >
      {label}
    </button>
  );
}
