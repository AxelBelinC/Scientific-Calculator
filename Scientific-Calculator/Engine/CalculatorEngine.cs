using System;
using System.Collections.Generic;
using System.Globalization;

namespace Scientific_Calculator.Engine
{
    public class CalculatorEngine
    {
        // ── State ─────────────────────────────────────────────────────────────
        private enum InputState { Idle, EnteringNumber, OperatorEntered, PostResult, WaitingSecondArg }

        private InputState _state = InputState.Idle;
        private string _display = "0";
        private string _expression = "";
        private double _accumulator = 0;
        private string _pendingOperator = "";
        private int _openParens = 0;

        // Flag: user explicitly pressed '(' — enables expression-parser evaluation path
        private bool _hasUserParens = false;

        // Two-arg pending (xⁿ, nCr, nPr, x^(1/n))
        // _twoArgOp != "" means we are collecting the second operand.
        // State can be WaitingSecondArg (before first digit) or EnteringNumber
        // (after first digit) — always check _twoArgOp != "" to detect this mode.
        private string _twoArgOp = "";
        private double _twoArgFirst = 0;

        private double _memory = 0;
        private bool _memoryHasValue = false;
        private AngleMode _angleMode = AngleMode.Degrees;

        private readonly List<HistoryEntry> _history = new List<HistoryEntry>();
        private const int MaxHistory = 20;

        // ── Events ────────────────────────────────────────────────────────────
        public event EventHandler DisplayChanged;
        public event EventHandler HistoryChanged;
        public event EventHandler AngleModeChanged;
        public event EventHandler MemoryChanged;

        // ── Properties ───────────────────────────────────────────────────────
        public string DisplayValue => _display;
        public string ExpressionDisplay => _expression;
        public AngleMode AngleMode => _angleMode;
        public bool MemoryHasValue => _memoryHasValue;
        public IReadOnlyList<HistoryEntry> History => _history.AsReadOnly();

        // ── Input: Digits ────────────────────────────────────────────────────
        public void InputDigit(char digit)
        {
            switch (_state)
            {
                case InputState.Idle:
                case InputState.PostResult:
                    _display = digit.ToString();
                    _expression = digit.ToString();
                    _state = InputState.EnteringNumber;
                    break;

                case InputState.WaitingSecondArg:
                    // First digit of the second operand: reset display, keep twoArg active.
                    _display = digit.ToString();
                    _expression += digit;
                    _state = InputState.EnteringNumber;
                    // NOTE: _twoArgOp is NOT cleared — InputEquals detects two-arg mode via _twoArgOp != ""
                    break;

                case InputState.OperatorEntered:
                    _display = digit.ToString();
                    _expression += digit;
                    _state = InputState.EnteringNumber;
                    break;

                case InputState.EnteringNumber:
                    if (_display == "0")
                    {
                        _display = digit.ToString();
                        ReplaceLastInExpression(digit.ToString());
                    }
                    else
                    {
                        _display += digit;
                        _expression += digit;
                    }
                    break;
            }
            OnDisplayChanged();
        }

        public void InputDecimal()
        {
            if (_state == InputState.PostResult || _state == InputState.Idle)
            {
                _display = "0.";
                _expression = "0.";
                _state = InputState.EnteringNumber;
            }
            else if (_state == InputState.OperatorEntered || _state == InputState.WaitingSecondArg)
            {
                _display = "0.";
                _expression += "0.";
                _state = InputState.EnteringNumber;
            }
            else if (!_display.Contains("."))
            {
                _display += ".";
                _expression += ".";
            }
            OnDisplayChanged();
        }

        // ── Input: Operators ─────────────────────────────────────────────────
        public void InputOperator(string op)
        {
            // Block operator input while collecting second arg for two-arg functions
            if (_twoArgOp != "") return;

            // Chaining: already have a pending op + second number → evaluate first
            if (_state == InputState.EnteringNumber && _pendingOperator != "" && !_hasUserParens)
            {
                double result = EvaluateSimple();
                if (double.IsNaN(result)) { ShowError(); return; }
                _accumulator = result;
                _display = FormatResult(result);
            }
            else if (_state != InputState.OperatorEntered)
            {
                _accumulator = ParseDisplay();
            }

            _pendingOperator = op;
            string sym = OperatorSymbol(op);

            if (_state == InputState.PostResult || _state == InputState.Idle)
                _expression = _display + " " + sym + " ";
            else
                _expression = _expression.TrimEnd() + " " + sym + " ";

            _state = InputState.OperatorEntered;
            OnDisplayChanged();
        }

        public void InputEquals()
        {
            // ── Two-arg function (xⁿ, nCr, nPr, x^(1/n)) ────────────────────
            if (_twoArgOp != "")
            {
                double second = ParseDisplay();
                double result = ApplyTwoArg(_twoArgOp, _twoArgFirst, second);
                string expr = FormatTwoArgExpression(_twoArgOp, _twoArgFirst, second);
                if (double.IsNaN(result)) { ShowError(); return; }
                AddHistory(expr, result);
                _display = FormatResult(result);
                _expression = expr + " =";
                _accumulator = result;
                _state = InputState.PostResult;
                _twoArgOp = "";
                OnDisplayChanged();
                return;
            }

            if (_state == InputState.Idle) return;

            double evalResult;
            string fullExpr;

            if (_hasUserParens)
            {
                // Close any open parens and evaluate via expression parser
                string expr = _expression;
                for (int i = 0; i < _openParens; i++) expr += ")";
                _openParens = 0;
                _hasUserParens = false;
                try { evalResult = ExpressionParser.Evaluate(expr, _angleMode); }
                catch { ShowError(); return; }
                fullExpr = expr;
            }
            else if (_pendingOperator != "")
            {
                // Simple binary mode — second operand already in display
                double second = _state == InputState.PostResult ? _accumulator : ParseDisplay();
                evalResult = ApplyBinary(_pendingOperator, _accumulator, second);
                fullExpr = $"{FormatResult(_accumulator)} {OperatorSymbol(_pendingOperator)} {FormatResult(second)}";
            }
            else
            {
                return;
            }

            if (double.IsNaN(evalResult)) { ShowError(); return; }

            AddHistory(fullExpr, evalResult);
            _display = FormatResult(evalResult);
            _expression = fullExpr + " =";
            _accumulator = evalResult;
            _pendingOperator = "";
            _state = InputState.PostResult;
            OnDisplayChanged();
        }

        // ── Input: Functions (unary) ──────────────────────────────────────────
        public void InputFunction(string fn)
        {
            double val = ParseDisplay();

            // Two-arg functions — enter pending mode
            if (fn == "pow" || fn == "nthroot" || fn == "ncr" || fn == "npr")
            {
                _twoArgFirst = val;
                _twoArgOp = fn;
                _expression = $"{FormatResult(val)} {TwoArgSymbol(fn)}";
                _state = InputState.WaitingSecondArg;
                OnDisplayChanged();
                return;
            }

            double result = ApplyUnary(fn, val);
            if (double.IsNaN(result)) { ShowError(); return; }

            string fnExpr = $"{FunctionLabel(fn)}({FormatResult(val)})";
            _display = FormatResult(result);

            if (_pendingOperator != "")
            {
                // Mid-expression: function is the second operand — preserve first operand in accumulator
                _expression = FormatResult(_accumulator) + " " + OperatorSymbol(_pendingOperator) + " " + fnExpr;
                _state = InputState.EnteringNumber;
                // _hasUserParens stays false — we remain in simple evaluation mode
            }
            else
            {
                AddHistory(fnExpr, result);
                _expression = fnExpr;
                _accumulator = result;
                _state = InputState.PostResult;
            }
            OnDisplayChanged();
        }

        // ── Input: Constants ──────────────────────────────────────────────────
        public void InputConstant(string name)
        {
            double val = name == "pi" ? Math.PI : Math.E;
            string label = name == "pi" ? "π" : "e";

            if (_state == InputState.OperatorEntered || _state == InputState.WaitingSecondArg)
            {
                _expression += label;
                _display = FormatResult(val);
                _state = InputState.EnteringNumber;
            }
            else if (_state == InputState.Idle || _state == InputState.PostResult)
            {
                _expression = label;
                _display = FormatResult(val);
                _state = InputState.PostResult;
            }
            else
            {
                _display = FormatResult(val);
                ReplaceLastInExpression(label);
            }
            OnDisplayChanged();
        }

        // ── Input: Parentheses ────────────────────────────────────────────────
        public void InputParenthesis(char p)
        {
            if (p == '(')
            {
                if (_state == InputState.PostResult) _expression = "(";
                else _expression += "(";
                _openParens++;
                _hasUserParens = true;
                _state = InputState.EnteringNumber;
            }
            else if (p == ')' && _openParens > 0)
            {
                _expression += ")";
                _openParens--;
            }
            OnDisplayChanged();
        }

        // ── Edit ─────────────────────────────────────────────────────────────
        public void Clear()
        {
            _display = "0"; _expression = ""; _accumulator = 0;
            _pendingOperator = ""; _openParens = 0;
            _twoArgOp = ""; _hasUserParens = false;
            _state = InputState.Idle;
            OnDisplayChanged();
        }

        public void ClearEntry()
        {
            _display = "0";
            if (_state == InputState.EnteringNumber)
            {
                int lastSpace = _expression.TrimEnd().LastIndexOf(' ');
                _expression = lastSpace >= 0 ? _expression.Substring(0, lastSpace + 1) : "";
                _state = _pendingOperator != "" ? InputState.OperatorEntered : InputState.Idle;
            }
            OnDisplayChanged();
        }

        public void Backspace()
        {
            if (_state != InputState.EnteringNumber || _display.Length == 0) return;
            _display = _display.Length == 1 ? "0" : _display.Substring(0, _display.Length - 1);
            if (_expression.Length > 0)
                _expression = _expression.Substring(0, _expression.Length - 1);
            if (_display == "0") _state = InputState.Idle;
            OnDisplayChanged();
        }

        public void ToggleSign()
        {
            double val = ParseDisplay();
            val = -val;
            _display = FormatResult(val);
            OnDisplayChanged();
        }

        // ── Mode ──────────────────────────────────────────────────────────────
        public void ToggleAngleMode()
        {
            _angleMode = _angleMode == AngleMode.Degrees ? AngleMode.Radians : AngleMode.Degrees;
            AngleModeChanged?.Invoke(this, EventArgs.Empty);
        }

        // ── Memory ────────────────────────────────────────────────────────────
        public void MemoryAdd()      { _memory += ParseDisplay(); _memoryHasValue = true; MemoryChanged?.Invoke(this, EventArgs.Empty); }
        public void MemorySubtract() { _memory -= ParseDisplay(); _memoryHasValue = true; MemoryChanged?.Invoke(this, EventArgs.Empty); }
        public void MemoryStore()    { _memory = ParseDisplay();  _memoryHasValue = true; MemoryChanged?.Invoke(this, EventArgs.Empty); }
        public void MemoryRecall()
        {
            if (!_memoryHasValue) return;
            _display = FormatResult(_memory);
            _state = InputState.PostResult;
            OnDisplayChanged();
        }
        public void MemoryClear() { _memory = 0; _memoryHasValue = false; MemoryChanged?.Invoke(this, EventArgs.Empty); }

        // ── Internal helpers ──────────────────────────────────────────────────
        private double ParseDisplay()
        {
            if (double.TryParse(_display, NumberStyles.Any, CultureInfo.InvariantCulture, out double v)) return v;
            return 0;
        }

        private double EvaluateSimple()
        {
            double second = ParseDisplay();
            return ApplyBinary(_pendingOperator, _accumulator, second);
        }

        private double ApplyBinary(string op, double a, double b)
        {
            switch (op)
            {
                case "+": return a + b;
                case "-": return a - b;
                case "*": return a * b;
                case "/": return b == 0 ? double.NaN : a / b;
                case "%": return a * (b / 100.0);
                default:  return double.NaN;
            }
        }

        private double ApplyUnary(string fn, double v)
        {
            double toRad   = _angleMode == AngleMode.Degrees ? Math.PI / 180.0 : 1.0;
            double fromRad = _angleMode == AngleMode.Degrees ? 180.0 / Math.PI : 1.0;
            switch (fn)
            {
                case "sin":    return Math.Sin(v * toRad);
                case "cos":    return Math.Cos(v * toRad);
                case "tan":    return Math.Tan(v * toRad);
                case "asin":   return Math.Abs(v) > 1 ? double.NaN : Math.Asin(v) * fromRad;
                case "acos":   return Math.Abs(v) > 1 ? double.NaN : Math.Acos(v) * fromRad;
                case "atan":   return Math.Atan(v) * fromRad;
                case "log":    return v <= 0 ? double.NaN : Math.Log10(v);
                case "ln":     return v <= 0 ? double.NaN : Math.Log(v);
                case "exp":    return Math.Exp(v);
                case "10x":    return Math.Pow(10, v);
                case "ex":     return Math.Exp(v);
                case "sqrt":   return v < 0 ? double.NaN : Math.Sqrt(v);
                case "cbrt":   return Math.Pow(v, 1.0 / 3.0);
                case "x2":     return v * v;
                case "x3":     return v * v * v;
                case "1x":     return v == 0 ? double.NaN : 1.0 / v;
                case "fact":   return Factorial(v);
                case "abs":    return Math.Abs(v);
                default:       return double.NaN;
            }
        }

        private double ApplyTwoArg(string op, double a, double b)
        {
            switch (op)
            {
                case "pow":     return Math.Pow(a, b);
                case "nthroot": return b == 0 ? double.NaN : Math.Pow(a, 1.0 / b);
                case "ncr":     return Combinations(a, b);
                case "npr":     return Permutations(a, b);
                default:        return double.NaN;
            }
        }

        private string TwoArgSymbol(string op)
        {
            switch (op)
            {
                case "pow":     return "^";
                case "nthroot": return "^(1/";
                case "ncr":     return "C";
                case "npr":     return "P";
                default:        return op;
            }
        }

        private string FormatTwoArgExpression(string op, double a, double b)
        {
            string sa = FormatResult(a), sb = FormatResult(b);
            switch (op)
            {
                case "pow":     return $"{sa} ^ {sb}";
                case "nthroot": return $"{sa} ^ (1/{sb})";
                case "ncr":     return $"{sa} C {sb}";
                case "npr":     return $"{sa} P {sb}";
                default:        return $"{sa} {op} {sb}";
            }
        }

        private double Factorial(double n)
        {
            if (n < 0 || n != Math.Floor(n)) return double.NaN;
            if (n > 170) return double.PositiveInfinity;
            double r = 1;
            for (int i = 2; i <= (int)n; i++) r *= i;
            return r;
        }

        private double Combinations(double n, double r)
        {
            if (r < 0 || r > n || n != Math.Floor(n) || r != Math.Floor(r)) return double.NaN;
            return Factorial(n) / (Factorial(r) * Factorial(n - r));
        }

        private double Permutations(double n, double r)
        {
            if (r < 0 || r > n || n != Math.Floor(n) || r != Math.Floor(r)) return double.NaN;
            return Factorial(n) / Factorial(n - r);
        }

        public static string FormatResult(double value)
        {
            if (double.IsNaN(value)) return "Entrada inválida";
            if (double.IsPositiveInfinity(value)) return "Infinito";
            if (double.IsNegativeInfinity(value)) return "-Infinito";
            return value.ToString("G15", CultureInfo.InvariantCulture);
        }

        private string OperatorSymbol(string op)
        {
            switch (op)
            {
                case "*": return "×";
                case "/": return "÷";
                default:  return op;
            }
        }

        private string FunctionLabel(string fn)
        {
            switch (fn)
            {
                case "asin": return "sin⁻¹";
                case "acos": return "cos⁻¹";
                case "atan": return "tan⁻¹";
                case "log":  return "log";
                case "ln":   return "ln";
                case "exp":  return "exp";
                case "10x":  return "10^";
                case "ex":   return "e^";
                case "sqrt": return "√";
                case "cbrt": return "∛";
                case "x2":   return "sqr";
                case "x3":   return "cube";
                case "1x":   return "1/";
                case "fact": return "";
                default:     return fn;
            }
        }

        private void ShowError()
        {
            _display = "Entrada inválida";
            _state = InputState.Idle;
            _pendingOperator = "";
            _twoArgOp = "";
            _hasUserParens = false;
            _expression = "";
            OnDisplayChanged();
        }

        private void AddHistory(string expr, double result)
        {
            _history.Insert(0, new HistoryEntry(expr, FormatResult(result)));
            if (_history.Count > MaxHistory) _history.RemoveAt(_history.Count - 1);
            HistoryChanged?.Invoke(this, EventArgs.Empty);
        }

        private void ReplaceLastInExpression(string replacement)
        {
            int last = _expression.TrimEnd().LastIndexOf(' ');
            _expression = last >= 0 ? _expression.Substring(0, last + 1) + replacement : replacement;
        }

        private void OnDisplayChanged() => DisplayChanged?.Invoke(this, EventArgs.Empty);
    }
}
