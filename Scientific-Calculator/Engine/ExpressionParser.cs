using System;
using System.Collections.Generic;
using System.Globalization;

namespace Scientific_Calculator.Engine
{
    internal enum TokenType { Number, Operator, Function, LeftParen, RightParen, Constant }

    internal class Token
    {
        public TokenType Type { get; }
        public string Value { get; }
        public Token(TokenType type, string value) { Type = type; Value = value; }
    }

    internal static class ExpressionParser
    {
        private static readonly Dictionary<string, int> Precedence = new Dictionary<string, int>
        {
            { "+", 1 }, { "-", 1 },
            { "*", 2 }, { "/", 2 }, { "%", 2 },
            { "neg", 3 },
            { "^", 4 }
        };

        private static bool IsLeftAssoc(string op) => op != "^" && op != "neg";

        public static double Evaluate(string expression, AngleMode angleMode, double xValue = double.NaN)
        {
            var tokens = Tokenize(expression, xValue);
            var rpn = ShuntingYard(tokens);
            return EvaluateRPN(rpn, angleMode);
        }

        private static List<Token> Tokenize(string expr, double xValue)
        {
            var tokens = new List<Token>();
            int i = 0;
            expr = expr.Trim();

            while (i < expr.Length)
            {
                char c = expr[i];

                if (char.IsWhiteSpace(c)) { i++; continue; }

                // Numbers
                if (char.IsDigit(c) || (c == '.' && i + 1 < expr.Length && char.IsDigit(expr[i + 1])))
                {
                    int start = i;
                    while (i < expr.Length && (char.IsDigit(expr[i]) || expr[i] == '.')) i++;
                    // scientific notation
                    if (i < expr.Length && (expr[i] == 'e' || expr[i] == 'E'))
                    {
                        i++;
                        if (i < expr.Length && (expr[i] == '+' || expr[i] == '-')) i++;
                        while (i < expr.Length && char.IsDigit(expr[i])) i++;
                    }
                    tokens.Add(new Token(TokenType.Number, expr.Substring(start, i - start)));
                    continue;
                }

                // Variable x (for grapher)
                if (c == 'x' && !double.IsNaN(xValue))
                {
                    tokens.Add(new Token(TokenType.Number, xValue.ToString("G17", CultureInfo.InvariantCulture)));
                    i++; continue;
                }

                // Named functions and constants
                if (char.IsLetter(c))
                {
                    int start = i;
                    while (i < expr.Length && char.IsLetterOrDigit(expr[i])) i++;
                    string word = expr.Substring(start, i - start).ToLower();
                    if (word == "pi" || word == "π") tokens.Add(new Token(TokenType.Number, Math.PI.ToString("G17", CultureInfo.InvariantCulture)));
                    else if (word == "e") tokens.Add(new Token(TokenType.Number, Math.E.ToString("G17", CultureInfo.InvariantCulture)));
                    else tokens.Add(new Token(TokenType.Function, word));
                    continue;
                }

                // π symbol directly
                if (c == 'π') { tokens.Add(new Token(TokenType.Number, Math.PI.ToString("G17", CultureInfo.InvariantCulture))); i++; continue; }

                // Operators
                if (c == '+' || c == '*' || c == '/' || c == '%' || c == '^')
                {
                    tokens.Add(new Token(TokenType.Operator, c.ToString())); i++; continue;
                }

                if (c == '-')
                {
                    // Unary minus if at start, after operator, or after left paren
                    bool unary = tokens.Count == 0 ||
                                 tokens[tokens.Count - 1].Type == TokenType.Operator ||
                                 tokens[tokens.Count - 1].Type == TokenType.LeftParen ||
                                 tokens[tokens.Count - 1].Type == TokenType.Function;
                    tokens.Add(unary
                        ? new Token(TokenType.Operator, "neg")
                        : new Token(TokenType.Operator, "-"));
                    i++; continue;
                }

                if (c == '(') { tokens.Add(new Token(TokenType.LeftParen, "(")); i++; continue; }
                if (c == ')') { tokens.Add(new Token(TokenType.RightParen, ")")); i++; continue; }

                // Unknown character — skip
                i++;
            }
            return tokens;
        }

        private static Queue<Token> ShuntingYard(List<Token> tokens)
        {
            var output = new Queue<Token>();
            var ops = new Stack<Token>();

            foreach (var tok in tokens)
            {
                switch (tok.Type)
                {
                    case TokenType.Number:
                        output.Enqueue(tok);
                        break;

                    case TokenType.Function:
                        ops.Push(tok);
                        break;

                    case TokenType.Operator:
                        while (ops.Count > 0 && ops.Peek().Type != TokenType.LeftParen &&
                               (ops.Peek().Type == TokenType.Function ||
                                (Precedence.ContainsKey(ops.Peek().Value) &&
                                 (Precedence[ops.Peek().Value] > Precedence[tok.Value] ||
                                  (Precedence[ops.Peek().Value] == Precedence[tok.Value] && IsLeftAssoc(tok.Value))))))
                        {
                            output.Enqueue(ops.Pop());
                        }
                        ops.Push(tok);
                        break;

                    case TokenType.LeftParen:
                        ops.Push(tok);
                        break;

                    case TokenType.RightParen:
                        while (ops.Count > 0 && ops.Peek().Type != TokenType.LeftParen)
                            output.Enqueue(ops.Pop());
                        if (ops.Count > 0) ops.Pop(); // pop left paren
                        if (ops.Count > 0 && ops.Peek().Type == TokenType.Function)
                            output.Enqueue(ops.Pop());
                        break;
                }
            }
            while (ops.Count > 0) output.Enqueue(ops.Pop());
            return output;
        }

        private static double EvaluateRPN(Queue<Token> rpn, AngleMode angleMode)
        {
            var stack = new Stack<double>();

            foreach (var tok in rpn)
            {
                if (tok.Type == TokenType.Number)
                {
                    stack.Push(double.Parse(tok.Value, CultureInfo.InvariantCulture));
                    continue;
                }

                if (tok.Type == TokenType.Operator)
                {
                    if (tok.Value == "neg")
                    {
                        double a = stack.Pop();
                        stack.Push(-a);
                        continue;
                    }
                    double b = stack.Pop(), x = stack.Pop();
                    switch (tok.Value)
                    {
                        case "+": stack.Push(x + b); break;
                        case "-": stack.Push(x - b); break;
                        case "*": stack.Push(x * b); break;
                        case "/": stack.Push(b == 0 ? double.NaN : x / b); break;
                        case "%": stack.Push(x % b); break;
                        case "^": stack.Push(Math.Pow(x, b)); break;
                    }
                    continue;
                }

                if (tok.Type == TokenType.Function)
                {
                    double v = stack.Pop();
                    stack.Push(ApplyFunction(tok.Value, v, angleMode));
                }
            }
            return stack.Count == 1 ? stack.Pop() : double.NaN;
        }

        private static double ApplyFunction(string name, double v, AngleMode mode)
        {
            double toRad = mode == AngleMode.Degrees ? Math.PI / 180.0 : 1.0;
            double fromRad = mode == AngleMode.Degrees ? 180.0 / Math.PI : 1.0;

            switch (name)
            {
                case "sin":   return Math.Sin(v * toRad);
                case "cos":   return Math.Cos(v * toRad);
                case "tan":   return Math.Tan(v * toRad);
                case "asin":  return Math.Asin(v) * fromRad;
                case "acos":  return Math.Acos(v) * fromRad;
                case "atan":  return Math.Atan(v) * fromRad;
                case "log":   return Math.Log10(v);
                case "log10": return Math.Log10(v);
                case "ln":    return Math.Log(v);
                case "exp":   return Math.Exp(v);
                case "sqrt":  return Math.Sqrt(v);
                case "cbrt":  return Math.Pow(v, 1.0 / 3.0);
                case "abs":   return Math.Abs(v);
                case "ceil":  return Math.Ceiling(v);
                case "floor": return Math.Floor(v);
                case "round": return Math.Round(v);
                default:      return double.NaN;
            }
        }
    }
}
