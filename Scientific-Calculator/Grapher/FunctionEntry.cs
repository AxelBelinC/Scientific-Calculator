using System.Drawing;

namespace Scientific_Calculator.Grapher
{
    public class FunctionEntry
    {
        public string Expression { get; set; }
        public Color Color { get; set; }
        public bool Visible { get; set; } = true;

        public FunctionEntry(string expression, Color color)
        {
            Expression = expression;
            Color = color;
        }
    }
}
