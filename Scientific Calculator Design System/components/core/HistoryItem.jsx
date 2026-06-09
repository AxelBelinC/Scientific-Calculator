export const HistoryItem = function(props) {
  var expression = props.expression || '';
  var result = props.result || '';
  var onClick = props.onClick;
  var state = React.useState(false);
  var hovered = state[0]; var setHovered = state[1];
  return React.createElement('div', {
    onClick: onClick,
    onMouseEnter: function() { setHovered(true); },
    onMouseLeave: function() { setHovered(false); },
    style: { background: hovered ? 'var(--color-btn-default)' : 'var(--color-history-item)', padding: '5px 10px 6px', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.05s', marginBottom: 4, borderRadius: 'var(--radius-sm)', boxSizing: 'border-box' },
  },
    React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-hist-expr)', color: 'var(--color-text-secondary)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'none' } }, expression),
    React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-hist-result)', color: 'var(--color-text-primary)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'none', marginTop: 1 } }, '= ' + result)
  );
};
