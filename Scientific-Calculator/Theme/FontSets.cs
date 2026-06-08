using System.Drawing;

namespace Scientific_Calculator.Theme
{
    internal static class FontSets
    {
        public static readonly Font Display     = new Font("Segoe UI Light", 36f, FontStyle.Regular);
        public static readonly Font Expression  = new Font("Segoe UI", 12f, FontStyle.Regular);
        public static readonly Font ButtonMain  = new Font("Segoe UI", 14f, FontStyle.Regular);
        public static readonly Font ButtonSci   = new Font("Segoe UI", 10f, FontStyle.Regular);
        public static readonly Font ButtonSmall = new Font("Segoe UI", 9f, FontStyle.Regular);
        public static readonly Font HistoryExpr = new Font("Segoe UI", 10f, FontStyle.Regular);
        public static readonly Font HistoryRes  = new Font("Segoe UI", 13f, FontStyle.Regular);
        public static readonly Font HistoryTitle= new Font("Segoe UI Semibold", 11f, FontStyle.Bold);
        public static readonly Font ModeToggle  = new Font("Segoe UI", 9f, FontStyle.Bold);
    }
}
