using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using Scientific_Calculator.Engine;
using Scientific_Calculator.Theme;

namespace Scientific_Calculator.Grapher
{
    internal static class GraphRenderer
    {
        private const int Points = 2000;

        public static Bitmap Render(
            IList<FunctionEntry> functions,
            double xMin, double xMax,
            double yMin, double yMax,
            int width, int height,
            AngleMode angleMode)
        {
            var bmp = new Bitmap(width, height);
            using (var g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.Clear(ColorPalette.Background);

                DrawGrid(g, xMin, xMax, yMin, yMax, width, height);
                DrawAxes(g, xMin, xMax, yMin, yMax, width, height);

                foreach (var fn in functions)
                {
                    if (fn.Visible && !string.IsNullOrWhiteSpace(fn.Expression))
                        DrawFunction(g, fn, xMin, xMax, yMin, yMax, width, height, angleMode);
                }
            }
            return bmp;
        }

        private static void DrawGrid(Graphics g, double xMin, double xMax, double yMin, double yMax, int w, int h)
        {
            using (var pen = new Pen(Color.FromArgb(45, 45, 45), 1))
            {
                double xStep = NiceStep((xMax - xMin) / 8);
                double yStep = NiceStep((yMax - yMin) / 8);

                double xStart = Math.Ceiling(xMin / xStep) * xStep;
                for (double x = xStart; x <= xMax; x += xStep)
                {
                    int px = ToPixelX(x, xMin, xMax, w);
                    g.DrawLine(pen, px, 0, px, h);
                    DrawLabel(g, x, new Point(px + 3, h - 16), false);
                }

                double yStart = Math.Ceiling(yMin / yStep) * yStep;
                for (double y = yStart; y <= yMax; y += yStep)
                {
                    int py = ToPixelY(y, yMin, yMax, h);
                    g.DrawLine(pen, 0, py, w, py);
                    DrawLabel(g, y, new Point(3, py - 14), true);
                }
            }
        }

        private static void DrawAxes(Graphics g, double xMin, double xMax, double yMin, double yMax, int w, int h)
        {
            using (var pen = new Pen(Color.FromArgb(90, 90, 90), 1))
            {
                // X axis
                if (yMin <= 0 && yMax >= 0)
                {
                    int py = ToPixelY(0, yMin, yMax, h);
                    g.DrawLine(pen, 0, py, w, py);
                }
                // Y axis
                if (xMin <= 0 && xMax >= 0)
                {
                    int px = ToPixelX(0, xMin, xMax, w);
                    g.DrawLine(pen, px, 0, px, h);
                }
            }
        }

        private static void DrawFunction(Graphics g, FunctionEntry fn,
            double xMin, double xMax, double yMin, double yMax,
            int w, int h, AngleMode angleMode)
        {
            using (var pen = new Pen(fn.Color, 2))
            {
                pen.LineJoin = LineJoin.Round;
                PointF? prev = null;
                double? prevY = null;

                for (int i = 0; i <= Points; i++)
                {
                    double x = xMin + (xMax - xMin) * i / Points;
                    double y = FunctionParser.Evaluate(fn.Expression, x, angleMode);

                    if (double.IsNaN(y) || double.IsInfinity(y))
                    {
                        prev = null; prevY = null; continue;
                    }

                    // Detect discontinuities (large jumps)
                    if (prevY.HasValue && Math.Abs(y - prevY.Value) > (yMax - yMin) * 5)
                    {
                        prev = null; prevY = null;
                    }

                    int px = ToPixelX(x, xMin, xMax, w);
                    int py = ToPixelY(y, yMin, yMax, h);
                    var cur = new PointF(px, py);

                    if (prev.HasValue)
                        g.DrawLine(pen, prev.Value, cur);

                    prev = cur;
                    prevY = y;
                }
            }
        }

        private static void DrawLabel(Graphics g, double value, Point pos, bool isY)
        {
            if (Math.Abs(value) < 1e-10) return;
            string text = value.ToString("G4");
            using (var brush = new SolidBrush(Color.FromArgb(100, 100, 100)))
            using (var font = new Font("Segoe UI", 7.5f))
                g.DrawString(text, font, brush, pos);
        }

        private static double NiceStep(double raw)
        {
            double mag = Math.Pow(10, Math.Floor(Math.Log10(Math.Abs(raw))));
            double norm = raw / mag;
            double nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
            return nice * mag;
        }

        private static int ToPixelX(double x, double xMin, double xMax, int w) =>
            (int)((x - xMin) / (xMax - xMin) * w);

        private static int ToPixelY(double y, double yMin, double yMax, int h) =>
            (int)((yMax - y) / (yMax - yMin) * h);

        // ── Root finding ─────────────────────────────────────────────────────
        public static List<double> FindRoots(FunctionEntry fn, double xMin, double xMax, AngleMode mode)
        {
            var roots = new List<double>();
            int steps = 2000;
            double? prevY = null;
            double prevX = xMin;

            for (int i = 0; i <= steps; i++)
            {
                double x = xMin + (xMax - xMin) * i / steps;
                double y = FunctionParser.Evaluate(fn.Expression, x, mode);
                if (double.IsNaN(y) || double.IsInfinity(y)) { prevY = null; continue; }

                if (prevY.HasValue && prevY.Value * y < 0)
                {
                    double root = Bisect(fn, prevX, x, mode);
                    if (!double.IsNaN(root)) roots.Add(root);
                }
                prevX = x; prevY = y;
            }
            return roots;
        }

        private static double Bisect(FunctionEntry fn, double a, double b, AngleMode mode)
        {
            for (int i = 0; i < 50; i++)
            {
                double mid = (a + b) / 2;
                double fMid = FunctionParser.Evaluate(fn.Expression, mid, mode);
                double fA   = FunctionParser.Evaluate(fn.Expression, a, mode);
                if (Math.Abs(b - a) < 1e-10) return mid;
                if (fA * fMid < 0) b = mid; else a = mid;
            }
            return (a + b) / 2;
        }
    }
}
