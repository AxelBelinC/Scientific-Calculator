using System;
using Scientific_Calculator.Engine;

namespace Scientific_Calculator.Grapher
{
    internal static class FunctionParser
    {
        public static double Evaluate(string expression, double x, AngleMode angleMode)
        {
            try
            {
                return ExpressionParser.Evaluate(expression, angleMode, x);
            }
            catch
            {
                return double.NaN;
            }
        }
    }
}
