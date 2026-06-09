using System.Drawing;

namespace Scientific_Calculator.Theme
{
    internal static class ColorPalette
    {
        public static readonly Color Background    = Color.FromArgb(28, 28, 28);
        public static readonly Color DisplayBg     = Color.FromArgb(20, 20, 20);
        public static readonly Color ButtonDefault = Color.FromArgb(50, 50, 50);
        public static readonly Color ButtonHover   = Color.FromArgb(68, 68, 68);
        public static readonly Color ButtonPress   = Color.FromArgb(38, 38, 38);
        public static readonly Color Operator      = Color.FromArgb(45, 55, 75);
        public static readonly Color OperatorHover = Color.FromArgb(60, 75, 100);
        public static readonly Color ScientificFn  = Color.FromArgb(38, 50, 65);
        public static readonly Color ScientificHov = Color.FromArgb(52, 68, 88);
        public static readonly Color EqualsBtn     = Color.FromArgb(0, 103, 192);
        public static readonly Color EqualsHover   = Color.FromArgb(0, 120, 215);
        public static readonly Color Memory        = Color.FromArgb(50, 38, 60);
        public static readonly Color MemoryHover   = Color.FromArgb(68, 52, 82);
        public static readonly Color Utility       = Color.FromArgb(62, 40, 40);
        public static readonly Color UtilityHover  = Color.FromArgb(85, 55, 55);
        public static readonly Color DisplayText   = Color.White;
        public static readonly Color SecondaryText = Color.FromArgb(160, 160, 160);
        public static readonly Color HistoryBg     = Color.FromArgb(24, 24, 24);
        public static readonly Color HistoryItem   = Color.FromArgb(36, 36, 36);
        public static readonly Color HistoryBorder = Color.FromArgb(50, 50, 50);
        public static readonly Color AccentText    = Color.FromArgb(0, 160, 255);
    }
}
