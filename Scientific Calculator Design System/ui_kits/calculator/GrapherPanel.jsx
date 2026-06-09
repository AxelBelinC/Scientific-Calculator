// Grapher window for the calculator UI kit
// Mirrors FormGrapher.cs layout and interaction model

const GRAPH_COLORS = ['#00a0ff','#ff5050','#50c850','#ffaa00','#b450ff','#00dcc8'];

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
  } catch { return NaN; }
}

function niceStep(v) {
  const p = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1)));
  const f = v / p;
  return f < 1.5 ? p : f < 3.5 ? 2*p : f < 7.5 ? 5*p : 10*p;
}
function fmt(v) { return parseFloat(v.toPrecision(4)).toString(); }

function GraphCanvas({ fns, range, width, height, angleMode, onRangeChange }) {
  const canvasRef = React.useRef(null);
  const panRef    = React.useRef(null);

  React.useEffect(() => { draw(); }, [fns, range, width, height]);

  function toPixel(x, y) {
    const px = ((x - range.xMin) / (range.xMax - range.xMin)) * width;
    const py = ((range.yMax - y) / (range.yMax - range.yMin)) * height;
    return [px, py];
  }

  function draw() {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const r = range;
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = '#1c1c1c'; ctx.fillRect(0,0,width,height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
    const xs = niceStep((r.xMax-r.xMin)/8);
    for (let gx = Math.ceil(r.xMin/xs)*xs; gx <= r.xMax; gx += xs) {
      const [px] = toPixel(gx,0); ctx.beginPath(); ctx.moveTo(px,0); ctx.lineTo(px,height); ctx.stroke();
    }
    const ys = niceStep((r.yMax-r.yMin)/8);
    for (let gy = Math.ceil(r.yMin/ys)*ys; gy <= r.yMax; gy += ys) {
      const [,py] = toPixel(0,gy); ctx.beginPath(); ctx.moveTo(0,py); ctx.lineTo(width,py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    const [ax] = toPixel(0,0); const [,ay] = toPixel(0,0);
    ctx.beginPath(); ctx.moveTo(ax,0); ctx.lineTo(ax,height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,ay); ctx.lineTo(width,ay); ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(160,160,160,0.45)';
    ctx.font = "10px 'DM Sans','Segoe UI',sans-serif"; ctx.textAlign = 'left';
    for (let gx = Math.ceil(r.xMin/xs)*xs; gx <= r.xMax; gx += xs) {
      if (Math.abs(gx)<1e-9) continue;
      const [px,py] = toPixel(gx,0);
      ctx.fillText(fmt(gx), px+2, Math.min(Math.max(py+12,12),height-4));
    }
    for (let gy = Math.ceil(r.yMin/ys)*ys; gy <= r.yMax; gy += ys) {
      if (Math.abs(gy)<1e-9) continue;
      const [px,py] = toPixel(0,gy);
      ctx.fillText(fmt(gy), Math.min(Math.max(px+3,3),width-36), py-3);
    }

    // Functions
    fns.forEach((fn, i) => {
      if (!fn.expr.trim()) return;
      const color = GRAPH_COLORS[i % GRAPH_COLORS.length];
      ctx.strokeStyle = color; ctx.lineWidth = 1.8;
      ctx.beginPath(); let started = false;
      const steps = Math.min(width * 2, 1600);
      for (let s = 0; s <= steps; s++) {
        const x = r.xMin + (r.xMax - r.xMin) * (s / steps);
        const y = evalFn(fn.expr, x, angleMode);
        if (!isFinite(y)) { started = false; continue; }
        const [px,py] = toPixel(x, y);
        if (!started) { ctx.moveTo(px,py); started = true; } else ctx.lineTo(px,py);
      }
      ctx.stroke();
    });
  }

  function handleWheel(e) {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const cx = range.xMin + (range.xMax - range.xMin) * mx / width;
    const cy = range.yMax - (range.yMax - range.yMin) * my / height;
    onRangeChange({ xMin: cx+(range.xMin-cx)*factor, xMax: cx+(range.xMax-cx)*factor, yMin: cy+(range.yMin-cy)*factor, yMax: cy+(range.yMax-cy)*factor });
  }
  function handleDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    panRef.current = { sx: e.clientX-rect.left, sy: e.clientY-rect.top, r: {...range} };
  }
  function handleMove(e) {
    if (!panRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX-rect.left, my = e.clientY-rect.top;
    const pr = panRef.current.r;
    const dx = (pr.xMax-pr.xMin)*(panRef.current.sx-mx)/width;
    const dy = (pr.yMax-pr.yMin)*(my-panRef.current.sy)/height;
    onRangeChange({ xMin:pr.xMin+dx, xMax:pr.xMax+dx, yMin:pr.yMin+dy, yMax:pr.yMax+dy });
  }

  return React.createElement('canvas', {
    ref: canvasRef, width, height,
    style: { display:'block', cursor: panRef.current ? 'grabbing' : 'crosshair' },
    onWheel: handleWheel, onMouseDown: handleDown, onMouseMove: handleMove,
    onMouseUp: () => panRef.current = null, onMouseLeave: () => panRef.current = null,
  });
}

function GrapherPanel({ onClose, angleMode }) {
  const [fns, setFns] = React.useState([
    { expr: 'sin(x)', id: 1 },
    { expr: 'cos(x)', id: 2 },
  ]);
  const [input, setInput] = React.useState('');
  const [range, setRange] = React.useState({ xMin:-10, xMax:10, yMin:-6, yMax:6 });
  const [error, setError] = React.useState('');
  const nextId = React.useRef(3);

  function addFn() {
    if (!input.trim()) return;
    try { evalFn(input, 0, angleMode); } catch {
      setError('Expresión inválida'); return;
    }
    setFns(prev => [...prev, { expr: input.trim(), id: nextId.current++ }]);
    setInput(''); setError('');
  }

  function removeFn(id) { setFns(prev => prev.filter(f => f.id !== id)); }

  function autoRange() { setRange({ xMin:-10, xMax:10, yMin:-6, yMax:6 }); }

  const Btn = ({ label, onClick, style: s }) => {
    const [h, setH] = React.useState(false);
    return React.createElement('button', {
      onClick, onMouseEnter:()=>setH(true), onMouseLeave:()=>setH(false),
      style: { background: h ? '#3c4b64' : '#2d3749', color: '#fff', border: h ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent', borderRadius: 0, fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", fontSize:10, fontWeight:400, cursor:'pointer', padding:'0 10px', height:26, display:'inline-flex', alignItems:'center', userSelect:'none', outline:'none', ...s }
    }, label);
  };

  return React.createElement('div', {
    style: { position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)', zIndex:100 }
  },
    React.createElement('div', {
      style: { width:800, height:590, background:'#1c1c1c', display:'flex', flexDirection:'column', boxShadow:'0 8px 40px rgba(0,0,0,0.8)', overflow:'hidden' }
    },
      // Top bar
      React.createElement('div', {
        style: { height:32, background:'#202020', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', flexShrink:0 }
      },
        React.createElement('span', { style:{ fontFamily:"'DM Sans','Segoe UI',sans-serif", fontSize:12, color:'#a0a0a0', fontWeight:600, letterSpacing:'0.03em' } }, 'Graficadora'),
        React.createElement('button', {
          onClick:onClose,
          style:{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:14, lineHeight:1, padding:'2px 4px', fontFamily:'sans-serif' }
        }, '✕')
      ),
      // Content
      React.createElement('div', { style:{ flex:1, display:'flex', overflow:'hidden' } },
        // Side panel
        React.createElement('div', {
          style:{ width:220, background:'#181818', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }
        },
          // Function list
          React.createElement('div', { style:{ flex:1, overflowY:'auto', padding:'8px 6px', display:'flex', flexDirection:'column', gap:4 } },
            fns.length === 0
              ? React.createElement('div', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#444', padding:12, textAlign:'center' } }, 'No hay funciones.')
              : fns.map((fn, i) =>
                  React.createElement('div', { key:fn.id, style:{ display:'flex', alignItems:'center', gap:6, background:'#242424', padding:'4px 8px', height:28 } },
                    React.createElement('span', { style:{ width:8, height:8, borderRadius:'50%', background:GRAPH_COLORS[i%6], flexShrink:0 } }),
                    React.createElement('span', { style:{ fontFamily:"'DM Sans','Segoe UI',sans-serif", fontSize:10, color:'#e0e0e0', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, 'f(x) = ' + fn.expr),
                    React.createElement('button', {
                      onClick:()=>removeFn(fn.id),
                      style:{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:10, lineHeight:1, padding:0, flexShrink:0 }
                    }, '✕')
                  )
                )
          ),
          // Add function
          React.createElement('div', { style:{ padding:'6px 6px 8px', borderTop:'1px solid #282828', flexShrink:0 } },
            React.createElement('div', { style:{ fontFamily:"'DM Sans','Segoe UI',sans-serif", fontSize:9, color:'#555', marginBottom:4, paddingLeft:2, textTransform:'uppercase', letterSpacing:'0.05em' } }, 'f(x) ='),
            React.createElement('div', { style:{ display:'flex', gap:1 } },
              React.createElement('input', {
                value:input,
                onChange:e=>{ setInput(e.target.value); setError(''); },
                onKeyDown:e=>{ if(e.key==='Enter') addFn(); },
                placeholder:'sin(x)',
                style:{ flex:1, background:'#2d2d2d', border:'1px solid #3a3a3a', borderRadius:0, color:'#fff', fontFamily:"'DM Sans','Segoe UI',sans-serif", fontSize:11, padding:'0 6px', height:26, outline:'none' }
              }),
              React.createElement(Btn, { label:'+ Agregar', onClick:addFn })
            ),
            error ? React.createElement('div', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:'#ff5050', marginTop:4 } }, error) : null
          ),
          // Action buttons
          React.createElement('div', { style:{ padding:'0 6px 10px', display:'flex', flexDirection:'column', gap:4 } },
            React.createElement('div', { style:{ display:'flex', gap:1 } },
              React.createElement(Btn, { label:'Auto-rango', onClick:autoRange, style:{ flex:1, justifyContent:'center' } }),
              React.createElement(Btn, { label:'Raíces', onClick:()=>{}, style:{ flex:1, justifyContent:'center' } }),
            )
          )
        ),
        // Canvas
        React.createElement(GraphCanvas, {
          fns, range, width:580, height:558, angleMode: angleMode || 'DEG',
          onRangeChange: setRange,
        })
      )
    )
  );
}

window.GrapherPanel = GrapherPanel;
