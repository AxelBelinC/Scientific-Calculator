function CalcPanel({ engine, onToggleHistory, onOpenGrapher }) {
  const [display, setDisplay] = React.useState('0');
  const [expression, setExpression] = React.useState('');
  const [angleMode, setAngleMode] = React.useState('DEG');

  React.useEffect(() => {
    engine.on('displayChanged', () => { setDisplay(engine.displayValue); setExpression(engine.expressionDisplay); });
    engine.on('angleModeChanged', () => setAngleMode(engine.angleMode));
  }, [engine]);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if ('0123456789'.includes(e.key)) engine.inputDigit(e.key);
      else if (e.key === '+') engine.inputOperator('+');
      else if (e.key === '-') engine.inputOperator('-');
      else if (e.key === '*') engine.inputOperator('*');
      else if (e.key === '/') { e.preventDefault(); engine.inputOperator('/'); }
      else if (e.key === 'Enter' || e.key === '=') engine.inputEquals();
      else if (e.key === 'Backspace') engine.backspace();
      else if (e.key === 'Escape') engine.clear();
      else if (e.key === 'Delete') engine.clearEntry();
      else if (e.key === '.') engine.inputDecimal();
      else if (e.key === '%' && e.shiftKey) engine.inputOperator('%');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);

  const Btn = ({ label, role = 'default', size = 'sm', fn, style: extraStyle }) => {
    const [h, setH] = React.useState(false);
    const [p, setP] = React.useState(false);
    const ROLES = {
      default:    ['#323232','#444444'], operator:   ['#2d374b','#3c4b64'],
      scientific: ['#263241','#344458'], equals:     ['#0067c0','#0078d7'],
      memory:     ['#32263c','#44344b'], utility:    ['#3e2828','#553737'],
      toggle:     ['#263241','#344458'],
    };
    const [rest, hover] = ROLES[role] || ROLES.default;
    const bg = p ? '#262626' : h ? hover : rest;
    const fs = size === 'xs' ? '9px' : size === 'sm' ? '10px' : '14px';
    return React.createElement('button', {
      onClick: fn, onMouseEnter: () => setH(true), onMouseLeave: () => { setH(false); setP(false); },
      onMouseDown: () => setP(true), onMouseUp: () => setP(false),
      style: Object.assign({
        background: bg, color: '#fff', border: (h && !p) ? '1px solid rgba(255,255,255,0.31)' : '1px solid transparent',
        borderRadius: 0, fontFamily: "'Segoe UI','Source Sans 3',system-ui,sans-serif", fontSize: fs,
        fontWeight: size === 'xs' ? 700 : 400, cursor: 'pointer', padding: 0,
        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        userSelect: 'none', outline: 'none', transition: 'background 0.04s', boxSizing: 'border-box',
        lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden',
      }, extraStyle || {})
    }, label);
  };

  const gap = '1px';

  // Scientific grid: 6 cols × 3 rows
  const sciFns = [
    ['sin','cos','tan','sin⁻¹','cos⁻¹','tan⁻¹'],
    ['log','ln','10^x','e^x','√','∛'],
    ['x²','x³','xⁿ','x^(1/n)','1/x','n!'],
  ];
  const sciKeys = ['sin','cos','tan','asin','acos','atan','log','ln','10x','ex','sqrt','cbrt','x2','x3','pow','nthroot','1x','fact'];

  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', width: 400, minWidth: 400, height: '100%', background: '#1c1c1c', boxSizing: 'border-box', overflow: 'hidden' }
  },
    // Mode row
    React.createElement('div', { style: { height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: '0 6px', background: '#1c1c1c', flexShrink: 0 } },
      React.createElement('div', { style: { height: 22, width: 46, flexShrink: 0 } }, React.createElement(Btn, { label: 'Hist', role: 'toggle', size: 'xs', fn: onToggleHistory })),
      React.createElement('div', { style: { height: 22, width: 46, flexShrink: 0 } }, React.createElement(Btn, { label: 'Graf', role: 'scientific', size: 'xs', fn: onOpenGrapher })),
      React.createElement('div', { style: { height: 22, width: 50, flexShrink: 0 } }, React.createElement(Btn, { label: angleMode, role: 'toggle', size: 'xs', fn: () => engine.toggleAngleMode() })),
    ),
    // Expression
    React.createElement('div', {
      style: { height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10px', background: '#141414', fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 12, color: '#a0a0a0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0, userSelect: 'none' }
    }, expression || '\u00a0'),
    // Display
    React.createElement('div', {
      style: { height: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10px', background: '#141414', fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 36, fontWeight: 300, color: display === 'Entrada inválida' ? '#ff5050' : '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0, userSelect: 'none' }
    }, display),
    // Memory row
    React.createElement('div', { style: { height: 36, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap, background: '#1c1c1c', flexShrink: 0 } },
      ['MC','MR','M+','M−','MS'].map((lbl, i) =>
        React.createElement(Btn, { key: lbl, label: lbl, role: 'memory', size: 'sm', fn: [() => engine.memoryClear(), () => engine.memoryRecall(), () => engine.memoryAdd(), () => engine.memorySubtract(), () => engine.memoryStore()][i] })
      )
    ),
    // Scientific grid
    React.createElement('div', { style: { height: 160, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap, background: '#1c1c1c', flexShrink: 0 } },
      sciFns.flat().map((lbl, i) =>
        React.createElement(Btn, { key: i, label: lbl, role: 'scientific', size: 'sm', fn: () => engine.inputFunction(sciKeys[i]) })
      )
    ),
    // Numpad
    React.createElement('div', { style: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gridTemplateRows: 'repeat(6,1fr)', gap, background: '#1c1c1c' } },
      // Row 0: C CE ⌫ nCr nPr
      React.createElement(Btn, { key:'C',   label:'C',   role:'utility',    fn:()=>engine.clear() }),
      React.createElement(Btn, { key:'CE',  label:'CE',  role:'utility',    fn:()=>engine.clearEntry() }),
      React.createElement(Btn, { key:'bsp', label:'⌫',  role:'utility',    fn:()=>engine.backspace() }),
      React.createElement(Btn, { key:'nCr', label:'nCr', role:'scientific', size:'sm', fn:()=>engine.inputFunction('ncr') }),
      React.createElement(Btn, { key:'nPr', label:'nPr', role:'scientific', size:'sm', fn:()=>engine.inputFunction('npr') }),
      // Row 1: ( ) % π ÷
      React.createElement(Btn, { key:'(',  label:'(',  role:'scientific', fn:()=>engine.inputParenthesis('(') }),
      React.createElement(Btn, { key:')',  label:')',  role:'scientific', fn:()=>engine.inputParenthesis(')') }),
      React.createElement(Btn, { key:'pct',label:'%',  role:'operator',  fn:()=>engine.inputOperator('%') }),
      React.createElement(Btn, { key:'pi', label:'π',  role:'scientific', fn:()=>engine.inputConstant('pi') }),
      React.createElement(Btn, { key:'div',label:'÷',  role:'operator',  fn:()=>engine.inputOperator('/') }),
      // Row 2: 7 8 9 e ×
      React.createElement(Btn, { key:'7',  label:'7', fn:()=>engine.inputDigit('7') }),
      React.createElement(Btn, { key:'8',  label:'8', fn:()=>engine.inputDigit('8') }),
      React.createElement(Btn, { key:'9',  label:'9', fn:()=>engine.inputDigit('9') }),
      React.createElement(Btn, { key:'e',  label:'e', role:'scientific', fn:()=>engine.inputConstant('e') }),
      React.createElement(Btn, { key:'mul',label:'×', role:'operator', fn:()=>engine.inputOperator('*') }),
      // Row 3: 4 5 6 +/- −
      React.createElement(Btn, { key:'4',  label:'4', fn:()=>engine.inputDigit('4') }),
      React.createElement(Btn, { key:'5',  label:'5', fn:()=>engine.inputDigit('5') }),
      React.createElement(Btn, { key:'6',  label:'6', fn:()=>engine.inputDigit('6') }),
      React.createElement(Btn, { key:'pm', label:'+/−', fn:()=>engine.toggleSign() }),
      React.createElement(Btn, { key:'sub',label:'−', role:'operator', fn:()=>engine.inputOperator('-') }),
      // Row 4: 1 2 3 + (tall) = (tall)
      React.createElement(Btn, { key:'1',  label:'1', fn:()=>engine.inputDigit('1') }),
      React.createElement(Btn, { key:'2',  label:'2', fn:()=>engine.inputDigit('2') }),
      React.createElement(Btn, { key:'3',  label:'3', fn:()=>engine.inputDigit('3') }),
      React.createElement('div', { key:'plus-wrap', style: { gridRow: 'span 2' } },
        React.createElement('div', { style: { height: '100%', background: '#1c1c1c', display: 'flex' } },
          React.createElement(Btn, { label:'+', role:'operator', fn:()=>engine.inputOperator('+') })
        )
      ),
      React.createElement('div', { key:'eq-wrap', style: { gridRow: 'span 2' } },
        React.createElement('div', { style: { height: '100%', background: '#1c1c1c', display: 'flex' } },
          React.createElement(Btn, { label:'=', role:'equals', fn:()=>engine.inputEquals() })
        )
      ),
      // Row 5: 0 (wide) . (+ and = span from row 4)
      React.createElement('div', { key:'0-wrap', style: { gridColumn: 'span 2' } },
        React.createElement('div', { style: { height: '100%', background: '#1c1c1c', display: 'flex' } },
          React.createElement(Btn, { label:'0', fn:()=>engine.inputDigit('0') })
        )
      ),
      React.createElement(Btn, { key:'dot', label:'.', fn:()=>engine.inputDecimal() }),
    )
  );
}
window.CalcPanel = CalcPanel;
