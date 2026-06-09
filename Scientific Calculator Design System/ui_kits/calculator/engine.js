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
    this._listeners = { displayChanged: [], historyChanged: [], angleModeChanged: [] };
  }

  get displayValue()      { return this._display; }
  get expressionDisplay() { return this._expression; }
  get angleMode()         { return this._angleMode; }
  get memoryHasValue()    { return this._memoryHasValue; }
  get history()           { return [...this._history]; }

  on(event, fn) { if (this._listeners[event]) this._listeners[event].push(fn); }
  _emit(ev)     { (this._listeners[ev] || []).forEach(fn => fn()); }
  _onDisplay()  { this._emit('displayChanged'); }
  _onHistory()  { this._emit('historyChanged'); }
  _onAngle()    { this._emit('angleModeChanged'); }

  _parse()     { const v = parseFloat(this._display); return isNaN(v) ? 0 : v; }
  _fmt(value)  {
    if (value !== value) return 'Entrada inválida';
    if (!isFinite(value)) return value > 0 ? 'Infinito' : '-Infinito';
    return parseFloat(value.toPrecision(14)).toString();
  }
  _sym(op)    { return ({ '*': '×', '/': '÷' })[op] || op; }
  _toRad(v)   { return this._angleMode === 'DEG' ? v * Math.PI / 180 : v; }
  _fromRad(v) { return this._angleMode === 'DEG' ? v * 180 / Math.PI : v; }

  _binary(op, a, b) {
    switch (op) {
      case '+': return a + b;  case '-': return a - b;
      case '*': return a * b;  case '/': return b === 0 ? NaN : a / b;
      case '%': return a * (b / 100);  default: return NaN;
    }
  }

  _unary(fn, v) {
    const M = Math;
    switch (fn) {
      case 'sin': return M.sin(this._toRad(v));
      case 'cos': return M.cos(this._toRad(v));
      case 'tan': return M.tan(this._toRad(v));
      case 'asin': return M.abs(v) > 1 ? NaN : this._fromRad(M.asin(v));
      case 'acos': return M.abs(v) > 1 ? NaN : this._fromRad(M.acos(v));
      case 'atan': return this._fromRad(M.atan(v));
      case 'log': return v <= 0 ? NaN : M.log10(v);
      case 'ln':  return v <= 0 ? NaN : M.log(v);
      case '10x': return M.pow(10, v);
      case 'ex':  return M.exp(v);
      case 'sqrt': return v < 0 ? NaN : M.sqrt(v);
      case 'cbrt': return M.cbrt ? M.cbrt(v) : M.pow(v, 1/3);
      case 'x2': return v * v;    case 'x3': return v * v * v;
      case '1x': return v === 0 ? NaN : 1 / v;
      case 'fact': return this._fact(v);
      default: return NaN;
    }
  }

  _fact(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n > 170) return Infinity;
    let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
  }

  _twoArg(op, a, b) {
    switch (op) {
      case 'pow':     return Math.pow(a, b);
      case 'nthroot': return b === 0 ? NaN : Math.pow(a, 1 / b);
      case 'ncr':     return this._fact(a) / (this._fact(b) * this._fact(a - b));
      case 'npr':     return this._fact(a) / this._fact(a - b);
      default: return NaN;
    }
  }

  _fnLabel(fn) {
    return ({ asin:'sin⁻¹', acos:'cos⁻¹', atan:'tan⁻¹', log:'log', ln:'ln',
              '10x':'10^', ex:'e^', sqrt:'√', cbrt:'∛', x2:'sqr', x3:'cube', '1x':'1/', fact:'' })[fn] || fn;
  }

  _addHistory(expr, result) {
    this._history.unshift({ expression: expr, result: this._fmt(result) });
    if (this._history.length > 20) this._history.pop();
    this._onHistory();
  }

  _error() {
    this._display = 'Entrada inválida'; this._state = 'idle';
    this._pendingOp = ''; this._twoArgOp = ''; this._hasUserParens = false; this._expression = '';
    this._onDisplay();
  }

  _replaceLastExpr(rep) {
    const t = this._expression.trimEnd(), i = t.lastIndexOf(' ');
    this._expression = i >= 0 ? this._expression.substring(0, i + 1) + rep : rep;
  }

  inputDigit(digit) {
    const s = this._state;
    if (s === 'idle' || s === 'postResult') {
      this._display = digit; this._expression = digit; this._state = 'entering';
    } else if (s === 'waitingSecond' || s === 'operatorEntered') {
      this._display = digit; this._expression += digit; this._state = 'entering';
    } else {
      if (this._display === '0') { this._display = digit; this._replaceLastExpr(digit); }
      else { this._display += digit; this._expression += digit; }
    }
    this._onDisplay();
  }

  inputDecimal() {
    const s = this._state;
    if (s === 'postResult' || s === 'idle') { this._display = '0.'; this._expression = '0.'; this._state = 'entering'; }
    else if (s === 'operatorEntered' || s === 'waitingSecond') { this._display = '0.'; this._expression += '0.'; this._state = 'entering'; }
    else if (!this._display.includes('.')) { this._display += '.'; this._expression += '.'; }
    this._onDisplay();
  }

  inputOperator(op) {
    if (this._twoArgOp) return;
    if (this._state === 'entering' && this._pendingOp && !this._hasUserParens) {
      const r = this._binary(this._pendingOp, this._accumulator, this._parse());
      if (r !== r) { this._error(); return; }
      this._accumulator = r; this._display = this._fmt(r);
    } else if (this._state !== 'operatorEntered') { this._accumulator = this._parse(); }
    this._pendingOp = op;
    const sym = this._sym(op);
    if (this._state === 'postResult' || this._state === 'idle') this._expression = this._display + ' ' + sym + ' ';
    else this._expression = this._expression.trimEnd() + ' ' + sym + ' ';
    this._state = 'operatorEntered';
    this._onDisplay();
  }

  inputEquals() {
    if (this._twoArgOp) {
      const b = this._parse(), r = this._twoArg(this._twoArgOp, this._twoArgFirst, b);
      if (r !== r) { this._error(); return; }
      const expr = this._expression;
      this._addHistory(expr, r); this._display = this._fmt(r);
      this._expression = expr + ' ='; this._accumulator = r; this._state = 'postResult'; this._twoArgOp = '';
      this._onDisplay(); return;
    }
    if (this._state === 'idle') return;
    let result, fullExpr;
    if (this._hasUserParens) {
      let expr = this._expression;
      for (let i = 0; i < this._openParens; i++) expr += ')';
      this._openParens = 0; this._hasUserParens = false;
      try { result = this._evalExpr(expr); } catch(e) { this._error(); return; }
      fullExpr = expr;
    } else if (this._pendingOp) {
      const b = this._state === 'postResult' ? this._accumulator : this._parse();
      result = this._binary(this._pendingOp, this._accumulator, b);
      fullExpr = this._fmt(this._accumulator) + ' ' + this._sym(this._pendingOp) + ' ' + this._fmt(b);
    } else return;
    if (result !== result) { this._error(); return; }
    this._addHistory(fullExpr, result); this._display = this._fmt(result);
    this._expression = fullExpr + ' ='; this._accumulator = result; this._pendingOp = ''; this._state = 'postResult';
    this._onDisplay();
  }

  _evalExpr(expr) {
    let e = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g, Math.PI).replace(/\be\b/g, Math.E);
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return(' + e + ')')();
  }

  inputFunction(fn) {
    const val = this._parse();
    if (['pow','nthroot','ncr','npr'].includes(fn)) {
      this._twoArgFirst = val; this._twoArgOp = fn;
      const syms = { pow:'^', nthroot:'^(1/', ncr:' C ', npr:' P ' };
      this._expression = this._fmt(val) + ' ' + (syms[fn] || fn);
      this._state = 'waitingSecond'; this._onDisplay(); return;
    }
    const result = this._unary(fn, val);
    if (result !== result) { this._error(); return; }
    const fnExpr = this._fnLabel(fn) + '(' + this._fmt(val) + ')';
    this._display = this._fmt(result);
    if (this._pendingOp) {
      this._expression = this._fmt(this._accumulator) + ' ' + this._sym(this._pendingOp) + ' ' + fnExpr;
      this._state = 'entering';
    } else {
      this._addHistory(fnExpr, result); this._expression = fnExpr; this._accumulator = result; this._state = 'postResult';
    }
    this._onDisplay();
  }

  inputConstant(name) {
    const val = name === 'pi' ? Math.PI : Math.E, label = name === 'pi' ? 'π' : 'e';
    const s = this._state;
    if (s === 'operatorEntered' || s === 'waitingSecond') { this._expression += label; this._display = this._fmt(val); this._state = 'entering'; }
    else if (s === 'idle' || s === 'postResult') { this._expression = label; this._display = this._fmt(val); this._state = 'postResult'; }
    else { this._display = this._fmt(val); this._replaceLastExpr(label); }
    this._onDisplay();
  }

  inputParenthesis(p) {
    if (p === '(') {
      if (this._state === 'postResult') this._expression = '('; else this._expression += '(';
      this._openParens++; this._hasUserParens = true; this._state = 'entering';
    } else if (p === ')' && this._openParens > 0) { this._expression += ')'; this._openParens--; }
    this._onDisplay();
  }

  clear() {
    this._display='0'; this._expression=''; this._accumulator=0; this._pendingOp='';
    this._openParens=0; this._twoArgOp=''; this._hasUserParens=false; this._state='idle';
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
    this._display = this._display.length === 1 ? '0' : this._display.slice(0,-1);
    if (this._expression.length > 0) this._expression = this._expression.slice(0,-1);
    if (this._display === '0') this._state = 'idle';
    this._onDisplay();
  }

  toggleSign()      { this._display = this._fmt(-this._parse()); this._onDisplay(); }
  toggleAngleMode() { this._angleMode = this._angleMode === 'DEG' ? 'RAD' : 'DEG'; this._onAngle(); }
  memoryAdd()       { this._memory += this._parse(); this._memoryHasValue = true; }
  memorySubtract()  { this._memory -= this._parse(); this._memoryHasValue = true; }
  memoryStore()     { this._memory  = this._parse(); this._memoryHasValue = true; }
  memoryClear()     { this._memory = 0; this._memoryHasValue = false; }
  memoryRecall() {
    if (!this._memoryHasValue) return;
    this._display = this._fmt(this._memory); this._state = 'postResult'; this._onDisplay();
  }
}

window.CalculatorEngine = CalculatorEngine;
