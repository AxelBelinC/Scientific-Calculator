using System;

namespace Scientific_Calculator.Engine
{
    public class HistoryEntry
    {
        public string Expression { get; }
        public string Result { get; }
        public DateTime Timestamp { get; }

        public HistoryEntry(string expression, string result)
        {
            Expression = expression;
            Result = result;
            Timestamp = DateTime.Now;
        }

        public override string ToString() => $"{Expression} = {Result}";
    }
}
