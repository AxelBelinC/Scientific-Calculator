// Renamed from HistoryPanel to CalcHistoryPanel to avoid
// collision with components/core/HistoryPanel.jsx
function CalcHistoryPanel({ engine }) {
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    engine.on('historyChanged', () => setHistory([...engine.history]));
  }, [engine]);

  return React.createElement('div', {
    style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#181818', minWidth: 0, overflow: 'hidden' }
  },
    React.createElement('div', {
      style: { height: 36, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", fontSize: 11, fontWeight: 700, color: '#a0a0a0', background: '#181818', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }
    }, 'Historial'),
    React.createElement('div', {
      style: { flex: 1, overflowY: 'auto', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 4, scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }
    },
      history.length === 0
        ? React.createElement('div', { style: { fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", fontSize: 10, color: '#444', padding: '16px 6px', textAlign: 'center' } }, 'Sin cálculos aún')
        : history.map((item, i) =>
            React.createElement('div', {
              key: i,
              style: { background: '#242424', padding: '5px 10px 6px', boxSizing: 'border-box', flexShrink: 0 }
            },
              React.createElement('div', { style: { fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", fontSize: 10, color: '#a0a0a0', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.expression),
              React.createElement('div', { style: { fontFamily: "'Outfit','Segoe UI',system-ui,sans-serif", fontSize: 13, fontWeight: 400, color: '#fff', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 } }, '= ' + item.result)
            )
          )
    )
  );
}
window.CalcHistoryPanel = CalcHistoryPanel;
