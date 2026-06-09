import React from 'react';

/** Graph palette matching FormGrapher.cs _palette array */
const GRAPH_COLORS = ['#00a0ff','#ff5050','#50c850','#ffaa00','#b450ff','#00dcc8'];

/**
 * GraphView — canvas-based function plotter.
 * Mirrors FormGrapher.cs visual style and interaction model.
 */
export function GraphView({
  functions = [],
  width = 600,
  height = 400,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  angleMode = 'DEG',
  onRangeChange,
}) {
  const canvasRef = React.useRef(null);
  const [range, setRange] = React.useState({ xMin, xMax, yMin, yMax });
  const [panning, setPanning] = React.useState(null);

  React.useEffect(() => {
    setRange({ xMin, xMax, yMin, yMax });
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
    } catch { return NaN; }
  }

  function toPixel(x, y, r) {
    const px = ((x - r.xMin) / (r.xMax - r.xMin)) * width;
    const py = ((r.yMax - y) / (r.yMax - r.yMin)) * height;
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
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, height); ctx.stroke();
    }
    const yStep = niceStep((r.yMax - r.yMin) / 8);
    const yStart = Math.ceil(r.yMin / yStep) * yStep;
    for (let gy = yStart; gy <= r.yMax; gy += yStep) {
      const [, py] = toPixel(0, gy, r);
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(width, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    const [ax0] = toPixel(0, 0, r);
    const [, ay0] = toPixel(0, 0, r);
    ctx.beginPath(); ctx.moveTo(ax0, 0); ctx.lineTo(ax0, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, ay0); ctx.lineTo(width, ay0); ctx.stroke();

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
        if (!isFinite(y) || Math.abs(y) > (r.yMax - r.yMin) * 20) { started = false; continue; }
        const [px, py] = toPixel(x, y, r);
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
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
      yMax: cy + (r.yMax - cy) * factor,
    };
    setRange(nr);
    onRangeChange && onRangeChange(nr);
  }

  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    setPanning({ startX: e.clientX - rect.left, startY: e.clientY - rect.top, range: { ...range } });
  }

  function handleMouseMove(e) {
    if (!panning) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const r = panning.range;
    const dx = (r.xMax - r.xMin) * (panning.startX - mx) / width;
    const dy = (r.yMax - r.yMin) * (my - panning.startY) / height;
    const nr = { xMin: r.xMin + dx, xMax: r.xMax + dx, yMin: r.yMin + dy, yMax: r.yMax + dy };
    setRange(nr);
    onRangeChange && onRangeChange(nr);
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', cursor: panning ? 'grabbing' : 'crosshair' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setPanning(null)}
      onMouseLeave={() => setPanning(null)}
    />
  );
}
