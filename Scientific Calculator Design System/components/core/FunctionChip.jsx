export const FunctionChip = function(props) {
  var expression = props.expression || '';
  var color = props.color || 'var(--color-plot-1)';
  var onRemove = props.onRemove;
  var state = React.useState(false);
  var hovered = state[0]; var setHovered = state[1];
  return React.createElement('div', {
    onMouseEnter: function() { setHovered(true); },
    onMouseLeave: function() { setHovered(false); },
    style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: hovered ? 'var(--color-btn-default-hover)' : '#2d2d2d', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-chip)', padding: '3px 8px 3px 6px', height: 28, maxWidth: 200, boxSizing: 'border-box', userSelect: 'none', transition: 'background 0.05s' },
  },
    React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 } }),
    React.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-btn-xs)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 } }, 'f(x) = ' + expression),
    onRemove ? React.createElement('span', { onClick: onRemove, style: { fontSize: 10, color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1, flexShrink: 0 } }, '\u2715') : null
  );
};
