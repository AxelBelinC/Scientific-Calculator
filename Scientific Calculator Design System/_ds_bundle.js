/* @ds-bundle: {"format":3,"namespace":"ScientificCalculatorDesignSystem_00fb6d","components":[{"name":"CalcButton","sourcePath":"components/core/CalcButton.jsx"},{"name":"Display","sourcePath":"components/core/Display.jsx"},{"name":"FunctionChip","sourcePath":"components/core/FunctionChip.jsx"},{"name":"GraphView","sourcePath":"components/core/GraphView.jsx"},{"name":"HistoryItem","sourcePath":"components/core/HistoryItem.jsx"},{"name":"HistoryPanel","sourcePath":"components/core/HistoryPanel.jsx"}],"sourceHashes":{"components/core/CalcButton.jsx":"681db6d81eac","components/core/Display.jsx":"5ac70b403a6a","components/core/FunctionChip.jsx":"620be93d0713","components/core/GraphView.jsx":"442cf91e587a","components/core/HistoryItem.jsx":"2f126db97434","components/core/HistoryPanel.jsx":"1a4d86cd0a09","ui_kits/calculator/CalcHistoryPanel.jsx":"5b52184525aa","ui_kits/calculator/CalcPanel.jsx":"03104131ff66","ui_kits/calculator/GrapherPanel.jsx":"ac34c85a5461","ui_kits/calculator/engine.js":"5fbdf84298c2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ScientificCalculatorDesignSystem_00fb6d = window.ScientificCalculatorDesignSystem_00fb6d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/CalcButton.jsx
try { (() => {
/**
 * CalcButton — a single calculator key with role-based color coding.
 * Supports 7 roles matching the original ColorPalette.cs definitions.
 */
function CalcButton({
  label,
  role = 'default',
  onClick,
  disabled = false,
  colSpan = 1,
  rowSpan = 1,
  size = 'main',
  style: extraStyle = {}
}) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const colorMap = {
    default: {
      base: '#323232',
      hover: '#444444'
    },
    operator: {
      base: '#2d3749',
      hover: '#3c4b64'
    },
    scientific: {
      base: '#263241',
      hover: '#344458'
    },
    equals: {
      base: '#0067c0',
      hover: '#0078d7'
    },
    memory: {
      base: '#32263c',
      hover: '#443452'
    },
    utility: {
      base: '#3e2828',
      hover: '#553737'
    },
    toggle: {
      base: '#263241',
      hover: '#344458'
    }
  };
  const sizeMap = {
    main: {
      fontSize: 'var(--text-btn-main, 14px)',
      fontWeight: 400
    },
    sci: {
      fontSize: 'var(--text-btn-sci,  10px)',
      fontWeight: 400
    },
    sm: {
      fontSize: 'var(--text-btn-sm,    9px)',
      fontWeight: 700
    },
    large: {
      fontSize: '18px',
      fontWeight: 300
    }
  };
  const c = colorMap[role] || colorMap.default;
  const s = sizeMap[size] || sizeMap.main;
  const bg = pressed && !disabled ? '#262626' : hovered && !disabled ? c.hover : c.base;
  const border = hovered && !disabled ? '1px solid rgba(255,255,255,0.31)' : '1px solid transparent';
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
    gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined,
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
    ...extraStyle
  };
  return /*#__PURE__*/React.createElement("button", {
    style: btnStyle,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    disabled: disabled,
    "aria-label": label
  }, label);
}
Object.assign(__ds_scope, { CalcButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CalcButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Display.jsx
try { (() => {
/**
 * Display — the calculator result + expression area.
 * Mirrors Form1.cs BuildDisplayLabel + BuildExpressionLabel.
 */
function Display({
  value = '0',
  expression = '',
  angleMode = 'DEG'
}) {
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
    overflow: 'hidden'
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
    minHeight: '16px'
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
    maxWidth: '100%'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: containerStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: exprStyle
  }, expression || '\u00a0'), /*#__PURE__*/React.createElement("div", {
    style: valueStyle
  }, value));
}
Object.assign(__ds_scope, { Display });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Display.jsx", error: String((e && e.message) || e) }); }

// components/core/FunctionChip.jsx
try { (() => {
const FunctionChip = function (props) {
  var expression = props.expression || '';
  var color = props.color || 'var(--color-plot-1)';
  var onRemove = props.onRemove;
  var state = React.useState(false);
  var hovered = state[0];
  var setHovered = state[1];
  return React.createElement('div', {
    onMouseEnter: function () {
      setHovered(true);
    },
    onMouseLeave: function () {
      setHovered(false);
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: hovered ? 'var(--color-btn-default-hover)' : '#2d2d2d',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-chip)',
      padding: '3px 8px 3px 6px',
      height: 28,
      maxWidth: 200,
      boxSizing: 'border-box',
      userSelect: 'none',
      transition: 'background 0.05s'
    }
  }, React.createElement('span', {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      flexShrink: 0
    }
  }), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--font-size-btn-xs)',
      color: 'var(--color-text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1
    }
  }, 'f(x) = ' + expression), onRemove ? React.createElement('span', {
    onClick: onRemove,
    style: {
      fontSize: 10,
      color: 'var(--color-text-secondary)',
      cursor: 'pointer',
      lineHeight: 1,
      flexShrink: 0
    }
  }, '\u2715') : null);
};
Object.assign(__ds_scope, { FunctionChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FunctionChip.jsx", error: String((e && e.message) || e) }); }

// components/core/GraphView.jsx
try { (() => {
/** Graph palette matching FormGrapher.cs _palette array */
const GRAPH_COLORS = ['#00a0ff', '#ff5050', '#50c850', '#ffaa00', '#b450ff', '#00dcc8'];

/**
 * GraphView — canvas-based function plotter.
 * Mirrors FormGrapher.cs visual style and interaction model.
 */
function GraphView({
  functions = [],
  width = 600,
  height = 400,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  angleMode = 'DEG',
  onRangeChange
}) {
  const canvasRef = React.useRef(null);
  const [range, setRange] = React.useState({
    xMin,
    xMax,
    yMin,
    yMax
  });
  const [panning, setPanning] = React.useState(null);
  React.useEffect(() => {
    setRange({
      xMin,
      xMax,
      yMin,
      yMax
    });
  }, [xMin, xMax, yMin, yMax]);
  React.useEffect(() => {
    drawGraph();
  }, [functions, range, width, height, angleMode]);
  function evalFn(expr, x) {
    try {
      const toRad = angleMode === 'DEG' ? Math.PI / 180 : 1;
      const fromRad = angleMode === 'DEG' ? 180 / Math.PI : 1;
      // safe eval with math functions
      const fn = new Function('x', 'Math', 'toRad', 'fromRad', `
        with(Math) {
          const sin = v => Math.sin(v * toRad);
          const cos = v => Math.cos(v * toRad);
          const tan = v => Math.tan(v * toRad);
          const asin = v => Math.asin(v) * fromRad;
          const acos = v => Math.acos(v) * fromRad;
          const atan = v => Math.atan(v) * fromRad;
          return (${expr});
        }
      `);
      return fn(x, Math, toRad, fromRad);
    } catch {
      return NaN;
    }
  }
  function toPixel(x, y, r) {
    const px = (x - r.xMin) / (r.xMax - r.xMin) * width;
    const py = (r.yMax - y) / (r.yMax - r.yMin) * height;
    return [px, py];
  }
  function drawGraph() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const r = range;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    const gridStep = niceStep((r.xMax - r.xMin) / 8);
    const xStart = Math.ceil(r.xMin / gridStep) * gridStep;
    for (let gx = xStart; gx <= r.xMax; gx += gridStep) {
      const [px] = toPixel(gx, 0, r);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    const yStep = niceStep((r.yMax - r.yMin) / 8);
    const yStart = Math.ceil(r.yMin / yStep) * yStep;
    for (let gy = yStart; gy <= r.yMax; gy += yStep) {
      const [, py] = toPixel(0, gy, r);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    const [ax0] = toPixel(0, 0, r);
    const [, ay0] = toPixel(0, 0, r);
    ctx.beginPath();
    ctx.moveTo(ax0, 0);
    ctx.lineTo(ax0, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, ay0);
    ctx.lineTo(width, ay0);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(160,160,160,0.55)';
    ctx.font = '10px DM Sans, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    for (let gx = xStart; gx <= r.xMax; gx += gridStep) {
      if (Math.abs(gx) < 1e-9) continue;
      const [px, py] = toPixel(gx, 0, r);
      ctx.fillText(fmt(gx), px + 2, Math.min(Math.max(py + 12, 12), height - 4));
    }
    for (let gy = yStart; gy <= r.yMax; gy += yStep) {
      if (Math.abs(gy) < 1e-9) continue;
      const [px, py] = toPixel(0, gy, r);
      ctx.fillText(fmt(gy), Math.min(Math.max(px + 3, 3), width - 30), py - 3);
    }

    // Functions
    functions.forEach((fn, i) => {
      const color = fn.color || GRAPH_COLORS[i % GRAPH_COLORS.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let started = false;
      const steps = Math.min(width * 2, 1600);
      for (let s = 0; s <= steps; s++) {
        const x = r.xMin + (r.xMax - r.xMin) * (s / steps);
        const y = evalFn(fn.expression, x);
        if (!isFinite(y) || Math.abs(y) > (r.yMax - r.yMin) * 20) {
          started = false;
          continue;
        }
        const [px, py] = toPixel(x, y, r);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }
  function niceStep(v) {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const f = v / p;
    if (f < 1.5) return p;
    if (f < 3.5) return 2 * p;
    if (f < 7.5) return 5 * p;
    return 10 * p;
  }
  function fmt(v) {
    return parseFloat(v.toPrecision(4)).toString();
  }
  function handleWheel(e) {
    e.preventDefault();
    const r = range;
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = r.xMin + (r.xMax - r.xMin) * mx / width;
    const cy = r.yMax - (r.yMax - r.yMin) * my / height;
    const nr = {
      xMin: cx + (r.xMin - cx) * factor,
      xMax: cx + (r.xMax - cx) * factor,
      yMin: cy + (r.yMin - cy) * factor,
      yMax: cy + (r.yMax - cy) * factor
    };
    setRange(nr);
    onRangeChange && onRangeChange(nr);
  }
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    setPanning({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      range: {
        ...range
      }
    });
  }
  function handleMouseMove(e) {
    if (!panning) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const r = panning.range;
    const dx = (r.xMax - r.xMin) * (panning.startX - mx) / width;
    const dy = (r.yMax - r.yMin) * (my - panning.startY) / height;
    const nr = {
      xMin: r.xMin + dx,
      xMax: r.xMax + dx,
      yMin: r.yMin + dy,
      yMax: r.yMax + dy
    };
    setRange(nr);
    onRangeChange && onRangeChange(nr);
  }
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    width: width,
    height: height,
    style: {
      display: 'block',
      cursor: panning ? 'grabbing' : 'crosshair'
    },
    onWheel: handleWheel,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: () => setPanning(null),
    onMouseLeave: () => setPanning(null)
  });
}
Object.assign(__ds_scope, { GraphView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GraphView.jsx", error: String((e && e.message) || e) }); }

// components/core/HistoryItem.jsx
try { (() => {
const HistoryItem = function (props) {
  var expression = props.expression || '';
  var result = props.result || '';
  var onClick = props.onClick;
  var state = React.useState(false);
  var hovered = state[0];
  var setHovered = state[1];
  return React.createElement('div', {
    onClick: onClick,
    onMouseEnter: function () {
      setHovered(true);
    },
    onMouseLeave: function () {
      setHovered(false);
    },
    style: {
      background: hovered ? 'var(--color-btn-default)' : 'var(--color-history-item)',
      padding: '5px 10px 6px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background 0.05s',
      marginBottom: 4,
      borderRadius: 'var(--radius-sm)',
      boxSizing: 'border-box'
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--font-size-hist-expr)',
      color: 'var(--color-text-secondary)',
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'none'
    }
  }, expression), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--font-size-hist-result)',
      color: 'var(--color-text-primary)',
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      marginTop: 1
    }
  }, '= ' + result));
};
Object.assign(__ds_scope, { HistoryItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/HistoryItem.jsx", error: String((e && e.message) || e) }); }

// components/core/HistoryPanel.jsx
try { (() => {
/**
 * HistoryPanel — collapsible sidebar listing past calculations.
 * Mirrors HistoryPanel.cs layout and styling.
 */
function HistoryPanel({
  entries = [],
  visible = true
}) {
  if (!visible) return null;
  const panelStyle = {
    background: 'var(--color-history-bg, #181818)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box'
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
    boxSizing: 'border-box'
  };
  const scrollStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#444 transparent'
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
    flexShrink: 0
  };
  const exprStyle = {
    fontFamily: "var(--font-ui, 'DM Sans', 'Segoe UI', sans-serif)",
    fontSize: 'var(--text-hist-expr, 10px)',
    fontWeight: 400,
    color: 'var(--color-text-secondary, #a0a0a0)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  };
  const resultStyle = {
    fontFamily: "var(--font-display, 'Outfit', 'Segoe UI Light', sans-serif)",
    fontSize: 'var(--text-hist-result, 13px)',
    fontWeight: 'var(--weight-regular, 400)',
    color: 'var(--color-text-primary, #ffffff)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  };
  const emptyStyle = {
    ...exprStyle,
    textAlign: 'center',
    padding: '24px 12px',
    opacity: 0.5
  };
  return /*#__PURE__*/React.createElement("div", {
    style: panelStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: titleStyle
  }, "Historial"), /*#__PURE__*/React.createElement("div", {
    style: scrollStyle
  }, entries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: emptyStyle
  }, "Sin c\xE1lculos a\xFAn") : entries.map((entry, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: itemStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: exprStyle
  }, entry.expression), /*#__PURE__*/React.createElement("div", {
    style: resultStyle
  }, "= ", entry.result)))));
}
Object.assign(__ds_scope, { HistoryPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/HistoryPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calculator/CalcHistoryPanel.jsx
try { (() => {
// Renamed from HistoryPanel to CalcHistoryPanel to avoid
// collision with components/core/HistoryPanel.jsx
function CalcHistoryPanel({
  engine
}) {
  const [history, setHistory] = React.useState([]);
  React.useEffect(() => {
    engine.on('historyChanged', () => setHistory([...engine.history]));
  }, [engine]);
  return React.createElement('div', {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#181818',
      minWidth: 0,
      overflow: 'hidden'
    }
  }, React.createElement('div', {
    style: {
      height: 36,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      fontSize: 11,
      fontWeight: 700,
      color: '#a0a0a0',
      background: '#181818',
      flexShrink: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, 'Historial'), React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      scrollbarWidth: 'thin',
      scrollbarColor: '#333 transparent'
    }
  }, history.length === 0 ? React.createElement('div', {
    style: {
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      fontSize: 10,
      color: '#444',
      padding: '16px 6px',
      textAlign: 'center'
    }
  }, 'Sin cálculos aún') : history.map((item, i) => React.createElement('div', {
    key: i,
    style: {
      background: '#242424',
      padding: '5px 10px 6px',
      boxSizing: 'border-box',
      flexShrink: 0
    }
  }, React.createElement('div', {
    style: {
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      fontSize: 10,
      color: '#a0a0a0',
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, item.expression), React.createElement('div', {
    style: {
      fontFamily: "'Outfit','Segoe UI',system-ui,sans-serif",
      fontSize: 13,
      fontWeight: 400,
      color: '#fff',
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginTop: 2
    }
  }, '= ' + item.result)))));
}
window.CalcHistoryPanel = CalcHistoryPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calculator/CalcHistoryPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calculator/CalcPanel.jsx
try { (() => {
function CalcPanel({
  engine,
  onToggleHistory,
  onOpenGrapher
}) {
  const [display, setDisplay] = React.useState('0');
  const [expression, setExpression] = React.useState('');
  const [angleMode, setAngleMode] = React.useState('DEG');
  React.useEffect(() => {
    engine.on('displayChanged', () => {
      setDisplay(engine.displayValue);
      setExpression(engine.expressionDisplay);
    });
    engine.on('angleModeChanged', () => setAngleMode(engine.angleMode));
  }, [engine]);

  // keyboard
  React.useEffect(() => {
    const onKey = e => {
      if ('0123456789'.includes(e.key)) engine.inputDigit(e.key);else if (e.key === '+') engine.inputOperator('+');else if (e.key === '-') engine.inputOperator('-');else if (e.key === '*') engine.inputOperator('*');else if (e.key === '/') {
        e.preventDefault();
        engine.inputOperator('/');
      } else if (e.key === 'Enter' || e.key === '=') engine.inputEquals();else if (e.key === 'Backspace') engine.backspace();else if (e.key === 'Escape') engine.clear();else if (e.key === 'Delete') engine.clearEntry();else if (e.key === '.') engine.inputDecimal();else if (e.key === '%' && e.shiftKey) engine.inputOperator('%');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);
  const Btn = ({
    label,
    role = 'default',
    size = 'sm',
    fn,
    style: extraStyle
  }) => {
    const [h, setH] = React.useState(false);
    const [p, setP] = React.useState(false);
    const ROLES = {
      default: ['#323232', '#444444'],
      operator: ['#2d374b', '#3c4b64'],
      scientific: ['#263241', '#344458'],
      equals: ['#0067c0', '#0078d7'],
      memory: ['#32263c', '#44344b'],
      utility: ['#3e2828', '#553737'],
      toggle: ['#263241', '#344458']
    };
    const [rest, hover] = ROLES[role] || ROLES.default;
    const bg = p ? '#262626' : h ? hover : rest;
    const fs = size === 'xs' ? '9px' : size === 'sm' ? '10px' : '14px';
    return React.createElement('button', {
      onClick: fn,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => {
        setH(false);
        setP(false);
      },
      onMouseDown: () => setP(true),
      onMouseUp: () => setP(false),
      style: Object.assign({
        background: bg,
        color: '#fff',
        border: h && !p ? '1px solid rgba(255,255,255,0.31)' : '1px solid transparent',
        borderRadius: 0,
        fontFamily: "'Segoe UI','Source Sans 3',system-ui,sans-serif",
        fontSize: fs,
        fontWeight: size === 'xs' ? 700 : 400,
        cursor: 'pointer',
        padding: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        outline: 'none',
        transition: 'background 0.04s',
        boxSizing: 'border-box',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }, extraStyle || {})
    }, label);
  };
  const gap = '1px';

  // Scientific grid: 6 cols × 3 rows
  const sciFns = [['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'], ['log', 'ln', '10^x', 'e^x', '√', '∛'], ['x²', 'x³', 'xⁿ', 'x^(1/n)', '1/x', 'n!']];
  const sciKeys = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', '10x', 'ex', 'sqrt', 'cbrt', 'x2', 'x3', 'pow', 'nthroot', '1x', 'fact'];
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: 400,
      minWidth: 400,
      height: '100%',
      background: '#1c1c1c',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }
  },
  // Mode row
  React.createElement('div', {
    style: {
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
      padding: '0 6px',
      background: '#1c1c1c',
      flexShrink: 0
    }
  }, React.createElement('div', {
    style: {
      height: 22,
      width: 46,
      flexShrink: 0
    }
  }, React.createElement(Btn, {
    label: 'Hist',
    role: 'toggle',
    size: 'xs',
    fn: onToggleHistory
  })), React.createElement('div', {
    style: {
      height: 22,
      width: 46,
      flexShrink: 0
    }
  }, React.createElement(Btn, {
    label: 'Graf',
    role: 'scientific',
    size: 'xs',
    fn: onOpenGrapher
  })), React.createElement('div', {
    style: {
      height: 22,
      width: 50,
      flexShrink: 0
    }
  }, React.createElement(Btn, {
    label: angleMode,
    role: 'toggle',
    size: 'xs',
    fn: () => engine.toggleAngleMode()
  }))),
  // Expression
  React.createElement('div', {
    style: {
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 10px',
      background: '#141414',
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      fontSize: 12,
      color: '#a0a0a0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: 0,
      userSelect: 'none'
    }
  }, expression || '\u00a0'),
  // Display
  React.createElement('div', {
    style: {
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 10px',
      background: '#141414',
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      fontSize: 36,
      fontWeight: 300,
      color: display === 'Entrada inválida' ? '#ff5050' : '#fff',
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: 0,
      userSelect: 'none'
    }
  }, display),
  // Memory row
  React.createElement('div', {
    style: {
      height: 36,
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap,
      background: '#1c1c1c',
      flexShrink: 0
    }
  }, ['MC', 'MR', 'M+', 'M−', 'MS'].map((lbl, i) => React.createElement(Btn, {
    key: lbl,
    label: lbl,
    role: 'memory',
    size: 'sm',
    fn: [() => engine.memoryClear(), () => engine.memoryRecall(), () => engine.memoryAdd(), () => engine.memorySubtract(), () => engine.memoryStore()][i]
  }))),
  // Scientific grid
  React.createElement('div', {
    style: {
      height: 160,
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gridTemplateRows: 'repeat(3,1fr)',
      gap,
      background: '#1c1c1c',
      flexShrink: 0
    }
  }, sciFns.flat().map((lbl, i) => React.createElement(Btn, {
    key: i,
    label: lbl,
    role: 'scientific',
    size: 'sm',
    fn: () => engine.inputFunction(sciKeys[i])
  }))),
  // Numpad
  React.createElement('div', {
    style: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gridTemplateRows: 'repeat(6,1fr)',
      gap,
      background: '#1c1c1c'
    }
  },
  // Row 0: C CE ⌫ nCr nPr
  React.createElement(Btn, {
    key: 'C',
    label: 'C',
    role: 'utility',
    fn: () => engine.clear()
  }), React.createElement(Btn, {
    key: 'CE',
    label: 'CE',
    role: 'utility',
    fn: () => engine.clearEntry()
  }), React.createElement(Btn, {
    key: 'bsp',
    label: '⌫',
    role: 'utility',
    fn: () => engine.backspace()
  }), React.createElement(Btn, {
    key: 'nCr',
    label: 'nCr',
    role: 'scientific',
    size: 'sm',
    fn: () => engine.inputFunction('ncr')
  }), React.createElement(Btn, {
    key: 'nPr',
    label: 'nPr',
    role: 'scientific',
    size: 'sm',
    fn: () => engine.inputFunction('npr')
  }),
  // Row 1: ( ) % π ÷
  React.createElement(Btn, {
    key: '(',
    label: '(',
    role: 'scientific',
    fn: () => engine.inputParenthesis('(')
  }), React.createElement(Btn, {
    key: ')',
    label: ')',
    role: 'scientific',
    fn: () => engine.inputParenthesis(')')
  }), React.createElement(Btn, {
    key: 'pct',
    label: '%',
    role: 'operator',
    fn: () => engine.inputOperator('%')
  }), React.createElement(Btn, {
    key: 'pi',
    label: 'π',
    role: 'scientific',
    fn: () => engine.inputConstant('pi')
  }), React.createElement(Btn, {
    key: 'div',
    label: '÷',
    role: 'operator',
    fn: () => engine.inputOperator('/')
  }),
  // Row 2: 7 8 9 e ×
  React.createElement(Btn, {
    key: '7',
    label: '7',
    fn: () => engine.inputDigit('7')
  }), React.createElement(Btn, {
    key: '8',
    label: '8',
    fn: () => engine.inputDigit('8')
  }), React.createElement(Btn, {
    key: '9',
    label: '9',
    fn: () => engine.inputDigit('9')
  }), React.createElement(Btn, {
    key: 'e',
    label: 'e',
    role: 'scientific',
    fn: () => engine.inputConstant('e')
  }), React.createElement(Btn, {
    key: 'mul',
    label: '×',
    role: 'operator',
    fn: () => engine.inputOperator('*')
  }),
  // Row 3: 4 5 6 +/- −
  React.createElement(Btn, {
    key: '4',
    label: '4',
    fn: () => engine.inputDigit('4')
  }), React.createElement(Btn, {
    key: '5',
    label: '5',
    fn: () => engine.inputDigit('5')
  }), React.createElement(Btn, {
    key: '6',
    label: '6',
    fn: () => engine.inputDigit('6')
  }), React.createElement(Btn, {
    key: 'pm',
    label: '+/−',
    fn: () => engine.toggleSign()
  }), React.createElement(Btn, {
    key: 'sub',
    label: '−',
    role: 'operator',
    fn: () => engine.inputOperator('-')
  }),
  // Row 4: 1 2 3 + (tall) = (tall)
  React.createElement(Btn, {
    key: '1',
    label: '1',
    fn: () => engine.inputDigit('1')
  }), React.createElement(Btn, {
    key: '2',
    label: '2',
    fn: () => engine.inputDigit('2')
  }), React.createElement(Btn, {
    key: '3',
    label: '3',
    fn: () => engine.inputDigit('3')
  }), React.createElement('div', {
    key: 'plus-wrap',
    style: {
      gridRow: 'span 2'
    }
  }, React.createElement('div', {
    style: {
      height: '100%',
      background: '#1c1c1c',
      display: 'flex'
    }
  }, React.createElement(Btn, {
    label: '+',
    role: 'operator',
    fn: () => engine.inputOperator('+')
  }))), React.createElement('div', {
    key: 'eq-wrap',
    style: {
      gridRow: 'span 2'
    }
  }, React.createElement('div', {
    style: {
      height: '100%',
      background: '#1c1c1c',
      display: 'flex'
    }
  }, React.createElement(Btn, {
    label: '=',
    role: 'equals',
    fn: () => engine.inputEquals()
  }))),
  // Row 5: 0 (wide) . (+ and = span from row 4)
  React.createElement('div', {
    key: '0-wrap',
    style: {
      gridColumn: 'span 2'
    }
  }, React.createElement('div', {
    style: {
      height: '100%',
      background: '#1c1c1c',
      display: 'flex'
    }
  }, React.createElement(Btn, {
    label: '0',
    fn: () => engine.inputDigit('0')
  }))), React.createElement(Btn, {
    key: 'dot',
    label: '.',
    fn: () => engine.inputDecimal()
  })));
}
window.CalcPanel = CalcPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calculator/CalcPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calculator/GrapherPanel.jsx
try { (() => {
// Grapher window for the calculator UI kit
// Mirrors FormGrapher.cs layout and interaction model

const GRAPH_COLORS = ['#00a0ff', '#ff5050', '#50c850', '#ffaa00', '#b450ff', '#00dcc8'];
function evalFn(expr, x, angleMode) {
  try {
    const toRad = angleMode === 'DEG' ? Math.PI / 180 : 1;
    const fromRad = angleMode === 'DEG' ? 180 / Math.PI : 1;
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `
      const sin  = v => Math.sin(v * ${toRad});
      const cos  = v => Math.cos(v * ${toRad});
      const tan  = v => Math.tan(v * ${toRad});
      const asin = v => Math.asin(v) * ${fromRad};
      const acos = v => Math.acos(v) * ${fromRad};
      const atan = v => Math.atan(v) * ${fromRad};
      const log  = v => Math.log10(v);
      const ln   = v => Math.log(v);
      const sqrt = v => Math.sqrt(v);
      const abs  = v => Math.abs(v);
      const pow  = (a,b) => Math.pow(a,b);
      const pi = Math.PI, e = Math.E;
      return (${expr});
    `);
    const y = fn(x);
    return isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}
function niceStep(v) {
  const p = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1)));
  const f = v / p;
  return f < 1.5 ? p : f < 3.5 ? 2 * p : f < 7.5 ? 5 * p : 10 * p;
}
function fmt(v) {
  return parseFloat(v.toPrecision(4)).toString();
}
function GraphCanvas({
  fns,
  range,
  width,
  height,
  angleMode,
  onRangeChange
}) {
  const canvasRef = React.useRef(null);
  const panRef = React.useRef(null);
  React.useEffect(() => {
    draw();
  }, [fns, range, width, height]);
  function toPixel(x, y) {
    const px = (x - range.xMin) / (range.xMax - range.xMin) * width;
    const py = (range.yMax - y) / (range.yMax - range.yMin) * height;
    return [px, py];
  }
  function draw() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const r = range;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    const xs = niceStep((r.xMax - r.xMin) / 8);
    for (let gx = Math.ceil(r.xMin / xs) * xs; gx <= r.xMax; gx += xs) {
      const [px] = toPixel(gx, 0);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    const ys = niceStep((r.yMax - r.yMin) / 8);
    for (let gy = Math.ceil(r.yMin / ys) * ys; gy <= r.yMax; gy += ys) {
      const [, py] = toPixel(0, gy);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    const [ax] = toPixel(0, 0);
    const [, ay] = toPixel(0, 0);
    ctx.beginPath();
    ctx.moveTo(ax, 0);
    ctx.lineTo(ax, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, ay);
    ctx.lineTo(width, ay);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(160,160,160,0.45)';
    ctx.font = "10px 'DM Sans','Segoe UI',sans-serif";
    ctx.textAlign = 'left';
    for (let gx = Math.ceil(r.xMin / xs) * xs; gx <= r.xMax; gx += xs) {
      if (Math.abs(gx) < 1e-9) continue;
      const [px, py] = toPixel(gx, 0);
      ctx.fillText(fmt(gx), px + 2, Math.min(Math.max(py + 12, 12), height - 4));
    }
    for (let gy = Math.ceil(r.yMin / ys) * ys; gy <= r.yMax; gy += ys) {
      if (Math.abs(gy) < 1e-9) continue;
      const [px, py] = toPixel(0, gy);
      ctx.fillText(fmt(gy), Math.min(Math.max(px + 3, 3), width - 36), py - 3);
    }

    // Functions
    fns.forEach((fn, i) => {
      if (!fn.expr.trim()) return;
      const color = GRAPH_COLORS[i % GRAPH_COLORS.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let started = false;
      const steps = Math.min(width * 2, 1600);
      for (let s = 0; s <= steps; s++) {
        const x = r.xMin + (r.xMax - r.xMin) * (s / steps);
        const y = evalFn(fn.expr, x, angleMode);
        if (!isFinite(y)) {
          started = false;
          continue;
        }
        const [px, py] = toPixel(x, y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }
  function handleWheel(e) {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    const cx = range.xMin + (range.xMax - range.xMin) * mx / width;
    const cy = range.yMax - (range.yMax - range.yMin) * my / height;
    onRangeChange({
      xMin: cx + (range.xMin - cx) * factor,
      xMax: cx + (range.xMax - cx) * factor,
      yMin: cy + (range.yMin - cy) * factor,
      yMax: cy + (range.yMax - cy) * factor
    });
  }
  function handleDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    panRef.current = {
      sx: e.clientX - rect.left,
      sy: e.clientY - rect.top,
      r: {
        ...range
      }
    };
  }
  function handleMove(e) {
    if (!panRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    const pr = panRef.current.r;
    const dx = (pr.xMax - pr.xMin) * (panRef.current.sx - mx) / width;
    const dy = (pr.yMax - pr.yMin) * (my - panRef.current.sy) / height;
    onRangeChange({
      xMin: pr.xMin + dx,
      xMax: pr.xMax + dx,
      yMin: pr.yMin + dy,
      yMax: pr.yMax + dy
    });
  }
  return React.createElement('canvas', {
    ref: canvasRef,
    width,
    height,
    style: {
      display: 'block',
      cursor: panRef.current ? 'grabbing' : 'crosshair'
    },
    onWheel: handleWheel,
    onMouseDown: handleDown,
    onMouseMove: handleMove,
    onMouseUp: () => panRef.current = null,
    onMouseLeave: () => panRef.current = null
  });
}
function GrapherPanel({
  onClose,
  angleMode
}) {
  const [fns, setFns] = React.useState([{
    expr: 'sin(x)',
    id: 1
  }, {
    expr: 'cos(x)',
    id: 2
  }]);
  const [input, setInput] = React.useState('');
  const [range, setRange] = React.useState({
    xMin: -10,
    xMax: 10,
    yMin: -6,
    yMax: 6
  });
  const [error, setError] = React.useState('');
  const nextId = React.useRef(3);
  function addFn() {
    if (!input.trim()) return;
    try {
      evalFn(input, 0, angleMode);
    } catch {
      setError('Expresión inválida');
      return;
    }
    setFns(prev => [...prev, {
      expr: input.trim(),
      id: nextId.current++
    }]);
    setInput('');
    setError('');
  }
  function removeFn(id) {
    setFns(prev => prev.filter(f => f.id !== id));
  }
  function autoRange() {
    setRange({
      xMin: -10,
      xMax: 10,
      yMin: -6,
      yMax: 6
    });
  }
  const Btn = ({
    label,
    onClick,
    style: s
  }) => {
    const [h, setH] = React.useState(false);
    return React.createElement('button', {
      onClick,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        background: h ? '#3c4b64' : '#2d3749',
        color: '#fff',
        border: h ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
        borderRadius: 0,
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
        fontSize: 10,
        fontWeight: 400,
        cursor: 'pointer',
        padding: '0 10px',
        height: 26,
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        outline: 'none',
        ...s
      }
    }, label);
  };
  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
      zIndex: 100
    }
  }, React.createElement('div', {
    style: {
      width: 800,
      height: 590,
      background: '#1c1c1c',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 40px rgba(0,0,0,0.8)',
      overflow: 'hidden'
    }
  },
  // Top bar
  React.createElement('div', {
    style: {
      height: 32,
      background: '#202020',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      flexShrink: 0
    }
  }, React.createElement('span', {
    style: {
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      fontSize: 12,
      color: '#a0a0a0',
      fontWeight: 600,
      letterSpacing: '0.03em'
    }
  }, 'Graficadora'), React.createElement('button', {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1,
      padding: '2px 4px',
      fontFamily: 'sans-serif'
    }
  }, '✕')),
  // Content
  React.createElement('div', {
    style: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    }
  },
  // Side panel
  React.createElement('div', {
    style: {
      width: 220,
      background: '#181818',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden'
    }
  },
  // Function list
  React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, fns.length === 0 ? React.createElement('div', {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 10,
      color: '#444',
      padding: 12,
      textAlign: 'center'
    }
  }, 'No hay funciones.') : fns.map((fn, i) => React.createElement('div', {
    key: fn.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: '#242424',
      padding: '4px 8px',
      height: 28
    }
  }, React.createElement('span', {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: GRAPH_COLORS[i % 6],
      flexShrink: 0
    }
  }), React.createElement('span', {
    style: {
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      fontSize: 10,
      color: '#e0e0e0',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, 'f(x) = ' + fn.expr), React.createElement('button', {
    onClick: () => removeFn(fn.id),
    style: {
      background: 'none',
      border: 'none',
      color: '#555',
      cursor: 'pointer',
      fontSize: 10,
      lineHeight: 1,
      padding: 0,
      flexShrink: 0
    }
  }, '✕')))),
  // Add function
  React.createElement('div', {
    style: {
      padding: '6px 6px 8px',
      borderTop: '1px solid #282828',
      flexShrink: 0
    }
  }, React.createElement('div', {
    style: {
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      fontSize: 9,
      color: '#555',
      marginBottom: 4,
      paddingLeft: 2,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, 'f(x) ='), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 1
    }
  }, React.createElement('input', {
    value: input,
    onChange: e => {
      setInput(e.target.value);
      setError('');
    },
    onKeyDown: e => {
      if (e.key === 'Enter') addFn();
    },
    placeholder: 'sin(x)',
    style: {
      flex: 1,
      background: '#2d2d2d',
      border: '1px solid #3a3a3a',
      borderRadius: 0,
      color: '#fff',
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      fontSize: 11,
      padding: '0 6px',
      height: 26,
      outline: 'none'
    }
  }), React.createElement(Btn, {
    label: '+ Agregar',
    onClick: addFn
  })), error ? React.createElement('div', {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 9,
      color: '#ff5050',
      marginTop: 4
    }
  }, error) : null),
  // Action buttons
  React.createElement('div', {
    style: {
      padding: '0 6px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      gap: 1
    }
  }, React.createElement(Btn, {
    label: 'Auto-rango',
    onClick: autoRange,
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }), React.createElement(Btn, {
    label: 'Raíces',
    onClick: () => {},
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  })))),
  // Canvas
  React.createElement(GraphCanvas, {
    fns,
    range,
    width: 580,
    height: 558,
    angleMode: angleMode || 'DEG',
    onRangeChange: setRange
  }))));
}
window.GrapherPanel = GrapherPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calculator/GrapherPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calculator/engine.js
try { (() => {
// Scientific Calculator Engine — ported from C# CalculatorEngine.cs
class CalculatorEngine {
  constructor() {
    this._state = 'idle'; // idle | entering | operatorEntered | postResult | waitingSecond
    this._display = '0';
    this._expression = '';
    this._accumulator = 0;
    this._pendingOp = '';
    this._openParens = 0;
    this._hasUserParens = false;
    this._twoArgOp = '';
    this._twoArgFirst = 0;
    this._memory = 0;
    this._memoryHasValue = false;
    this._angleMode = 'DEG';
    this._history = [];
    this._listeners = {
      displayChanged: [],
      historyChanged: [],
      angleModeChanged: []
    };
  }
  get displayValue() {
    return this._display;
  }
  get expressionDisplay() {
    return this._expression;
  }
  get angleMode() {
    return this._angleMode;
  }
  get memoryHasValue() {
    return this._memoryHasValue;
  }
  get history() {
    return [...this._history];
  }
  on(event, fn) {
    if (this._listeners[event]) this._listeners[event].push(fn);
  }
  _emit(ev) {
    (this._listeners[ev] || []).forEach(fn => fn());
  }
  _onDisplay() {
    this._emit('displayChanged');
  }
  _onHistory() {
    this._emit('historyChanged');
  }
  _onAngle() {
    this._emit('angleModeChanged');
  }
  _parse() {
    const v = parseFloat(this._display);
    return isNaN(v) ? 0 : v;
  }
  _fmt(value) {
    if (value !== value) return 'Entrada inválida';
    if (!isFinite(value)) return value > 0 ? 'Infinito' : '-Infinito';
    return parseFloat(value.toPrecision(14)).toString();
  }
  _sym(op) {
    return {
      '*': '×',
      '/': '÷'
    }[op] || op;
  }
  _toRad(v) {
    return this._angleMode === 'DEG' ? v * Math.PI / 180 : v;
  }
  _fromRad(v) {
    return this._angleMode === 'DEG' ? v * 180 / Math.PI : v;
  }
  _binary(op, a, b) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      case '%':
        return a * (b / 100);
      default:
        return NaN;
    }
  }
  _unary(fn, v) {
    const M = Math;
    switch (fn) {
      case 'sin':
        return M.sin(this._toRad(v));
      case 'cos':
        return M.cos(this._toRad(v));
      case 'tan':
        return M.tan(this._toRad(v));
      case 'asin':
        return M.abs(v) > 1 ? NaN : this._fromRad(M.asin(v));
      case 'acos':
        return M.abs(v) > 1 ? NaN : this._fromRad(M.acos(v));
      case 'atan':
        return this._fromRad(M.atan(v));
      case 'log':
        return v <= 0 ? NaN : M.log10(v);
      case 'ln':
        return v <= 0 ? NaN : M.log(v);
      case '10x':
        return M.pow(10, v);
      case 'ex':
        return M.exp(v);
      case 'sqrt':
        return v < 0 ? NaN : M.sqrt(v);
      case 'cbrt':
        return M.cbrt ? M.cbrt(v) : M.pow(v, 1 / 3);
      case 'x2':
        return v * v;
      case 'x3':
        return v * v * v;
      case '1x':
        return v === 0 ? NaN : 1 / v;
      case 'fact':
        return this._fact(v);
      default:
        return NaN;
    }
  }
  _fact(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }
  _twoArg(op, a, b) {
    switch (op) {
      case 'pow':
        return Math.pow(a, b);
      case 'nthroot':
        return b === 0 ? NaN : Math.pow(a, 1 / b);
      case 'ncr':
        return this._fact(a) / (this._fact(b) * this._fact(a - b));
      case 'npr':
        return this._fact(a) / this._fact(a - b);
      default:
        return NaN;
    }
  }
  _fnLabel(fn) {
    return {
      asin: 'sin⁻¹',
      acos: 'cos⁻¹',
      atan: 'tan⁻¹',
      log: 'log',
      ln: 'ln',
      '10x': '10^',
      ex: 'e^',
      sqrt: '√',
      cbrt: '∛',
      x2: 'sqr',
      x3: 'cube',
      '1x': '1/',
      fact: ''
    }[fn] || fn;
  }
  _addHistory(expr, result) {
    this._history.unshift({
      expression: expr,
      result: this._fmt(result)
    });
    if (this._history.length > 20) this._history.pop();
    this._onHistory();
  }
  _error() {
    this._display = 'Entrada inválida';
    this._state = 'idle';
    this._pendingOp = '';
    this._twoArgOp = '';
    this._hasUserParens = false;
    this._expression = '';
    this._onDisplay();
  }
  _replaceLastExpr(rep) {
    const t = this._expression.trimEnd(),
      i = t.lastIndexOf(' ');
    this._expression = i >= 0 ? this._expression.substring(0, i + 1) + rep : rep;
  }
  inputDigit(digit) {
    const s = this._state;
    if (s === 'idle' || s === 'postResult') {
      this._display = digit;
      this._expression = digit;
      this._state = 'entering';
    } else if (s === 'waitingSecond' || s === 'operatorEntered') {
      this._display = digit;
      this._expression += digit;
      this._state = 'entering';
    } else {
      if (this._display === '0') {
        this._display = digit;
        this._replaceLastExpr(digit);
      } else {
        this._display += digit;
        this._expression += digit;
      }
    }
    this._onDisplay();
  }
  inputDecimal() {
    const s = this._state;
    if (s === 'postResult' || s === 'idle') {
      this._display = '0.';
      this._expression = '0.';
      this._state = 'entering';
    } else if (s === 'operatorEntered' || s === 'waitingSecond') {
      this._display = '0.';
      this._expression += '0.';
      this._state = 'entering';
    } else if (!this._display.includes('.')) {
      this._display += '.';
      this._expression += '.';
    }
    this._onDisplay();
  }
  inputOperator(op) {
    if (this._twoArgOp) return;
    if (this._state === 'entering' && this._pendingOp && !this._hasUserParens) {
      const r = this._binary(this._pendingOp, this._accumulator, this._parse());
      if (r !== r) {
        this._error();
        return;
      }
      this._accumulator = r;
      this._display = this._fmt(r);
    } else if (this._state !== 'operatorEntered') {
      this._accumulator = this._parse();
    }
    this._pendingOp = op;
    const sym = this._sym(op);
    if (this._state === 'postResult' || this._state === 'idle') this._expression = this._display + ' ' + sym + ' ';else this._expression = this._expression.trimEnd() + ' ' + sym + ' ';
    this._state = 'operatorEntered';
    this._onDisplay();
  }
  inputEquals() {
    if (this._twoArgOp) {
      const b = this._parse(),
        r = this._twoArg(this._twoArgOp, this._twoArgFirst, b);
      if (r !== r) {
        this._error();
        return;
      }
      const expr = this._expression;
      this._addHistory(expr, r);
      this._display = this._fmt(r);
      this._expression = expr + ' =';
      this._accumulator = r;
      this._state = 'postResult';
      this._twoArgOp = '';
      this._onDisplay();
      return;
    }
    if (this._state === 'idle') return;
    let result, fullExpr;
    if (this._hasUserParens) {
      let expr = this._expression;
      for (let i = 0; i < this._openParens; i++) expr += ')';
      this._openParens = 0;
      this._hasUserParens = false;
      try {
        result = this._evalExpr(expr);
      } catch (e) {
        this._error();
        return;
      }
      fullExpr = expr;
    } else if (this._pendingOp) {
      const b = this._state === 'postResult' ? this._accumulator : this._parse();
      result = this._binary(this._pendingOp, this._accumulator, b);
      fullExpr = this._fmt(this._accumulator) + ' ' + this._sym(this._pendingOp) + ' ' + this._fmt(b);
    } else return;
    if (result !== result) {
      this._error();
      return;
    }
    this._addHistory(fullExpr, result);
    this._display = this._fmt(result);
    this._expression = fullExpr + ' =';
    this._accumulator = result;
    this._pendingOp = '';
    this._state = 'postResult';
    this._onDisplay();
  }
  _evalExpr(expr) {
    let e = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, Math.PI).replace(/\be\b/g, Math.E);
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return(' + e + ')')();
  }
  inputFunction(fn) {
    const val = this._parse();
    if (['pow', 'nthroot', 'ncr', 'npr'].includes(fn)) {
      this._twoArgFirst = val;
      this._twoArgOp = fn;
      const syms = {
        pow: '^',
        nthroot: '^(1/',
        ncr: ' C ',
        npr: ' P '
      };
      this._expression = this._fmt(val) + ' ' + (syms[fn] || fn);
      this._state = 'waitingSecond';
      this._onDisplay();
      return;
    }
    const result = this._unary(fn, val);
    if (result !== result) {
      this._error();
      return;
    }
    const fnExpr = this._fnLabel(fn) + '(' + this._fmt(val) + ')';
    this._display = this._fmt(result);
    if (this._pendingOp) {
      this._expression = this._fmt(this._accumulator) + ' ' + this._sym(this._pendingOp) + ' ' + fnExpr;
      this._state = 'entering';
    } else {
      this._addHistory(fnExpr, result);
      this._expression = fnExpr;
      this._accumulator = result;
      this._state = 'postResult';
    }
    this._onDisplay();
  }
  inputConstant(name) {
    const val = name === 'pi' ? Math.PI : Math.E,
      label = name === 'pi' ? 'π' : 'e';
    const s = this._state;
    if (s === 'operatorEntered' || s === 'waitingSecond') {
      this._expression += label;
      this._display = this._fmt(val);
      this._state = 'entering';
    } else if (s === 'idle' || s === 'postResult') {
      this._expression = label;
      this._display = this._fmt(val);
      this._state = 'postResult';
    } else {
      this._display = this._fmt(val);
      this._replaceLastExpr(label);
    }
    this._onDisplay();
  }
  inputParenthesis(p) {
    if (p === '(') {
      if (this._state === 'postResult') this._expression = '(';else this._expression += '(';
      this._openParens++;
      this._hasUserParens = true;
      this._state = 'entering';
    } else if (p === ')' && this._openParens > 0) {
      this._expression += ')';
      this._openParens--;
    }
    this._onDisplay();
  }
  clear() {
    this._display = '0';
    this._expression = '';
    this._accumulator = 0;
    this._pendingOp = '';
    this._openParens = 0;
    this._twoArgOp = '';
    this._hasUserParens = false;
    this._state = 'idle';
    this._onDisplay();
  }
  clearEntry() {
    this._display = '0';
    if (this._state === 'entering') {
      const i = this._expression.trimEnd().lastIndexOf(' ');
      this._expression = i >= 0 ? this._expression.substring(0, i + 1) : '';
      this._state = this._pendingOp ? 'operatorEntered' : 'idle';
    }
    this._onDisplay();
  }
  backspace() {
    if (this._state !== 'entering' || !this._display.length) return;
    this._display = this._display.length === 1 ? '0' : this._display.slice(0, -1);
    if (this._expression.length > 0) this._expression = this._expression.slice(0, -1);
    if (this._display === '0') this._state = 'idle';
    this._onDisplay();
  }
  toggleSign() {
    this._display = this._fmt(-this._parse());
    this._onDisplay();
  }
  toggleAngleMode() {
    this._angleMode = this._angleMode === 'DEG' ? 'RAD' : 'DEG';
    this._onAngle();
  }
  memoryAdd() {
    this._memory += this._parse();
    this._memoryHasValue = true;
  }
  memorySubtract() {
    this._memory -= this._parse();
    this._memoryHasValue = true;
  }
  memoryStore() {
    this._memory = this._parse();
    this._memoryHasValue = true;
  }
  memoryClear() {
    this._memory = 0;
    this._memoryHasValue = false;
  }
  memoryRecall() {
    if (!this._memoryHasValue) return;
    this._display = this._fmt(this._memory);
    this._state = 'postResult';
    this._onDisplay();
  }
}
window.CalculatorEngine = CalculatorEngine;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calculator/engine.js", error: String((e && e.message) || e) }); }

__ds_ns.CalcButton = __ds_scope.CalcButton;

__ds_ns.Display = __ds_scope.Display;

__ds_ns.FunctionChip = __ds_scope.FunctionChip;

__ds_ns.GraphView = __ds_scope.GraphView;

__ds_ns.HistoryItem = __ds_scope.HistoryItem;

__ds_ns.HistoryPanel = __ds_scope.HistoryPanel;

})();
