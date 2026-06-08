using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using Scientific_Calculator.Engine;
using Scientific_Calculator.Theme;
using Scientific_Calculator.UI;

namespace Scientific_Calculator.Grapher
{
    public class FormGrapher : Form
    {
        private readonly List<FunctionEntry> _functions = new List<FunctionEntry>();
        private readonly Color[] _palette = {
            Color.FromArgb(0, 160, 255), Color.FromArgb(255, 80, 80),
            Color.FromArgb(80, 200, 80), Color.FromArgb(255, 170, 0),
            Color.FromArgb(180, 80, 255), Color.FromArgb(0, 220, 200)
        };

        private double _xMin = -10, _xMax = 10, _yMin = -10, _yMax = 10;
        private AngleMode _angleMode;
        private bool _panning;
        private Point _panStart;
        private double _panXMin, _panXMax, _panYMin, _panYMax;

        private Panel _graphPanel;
        private FlowLayoutPanel _fnListPanel;
        private TextBox _inputBox;
        private Label _errorLabel;

        public FormGrapher(AngleMode angleMode)
        {
            _angleMode = angleMode;
            InitializeLayout();
        }

        private void InitializeLayout()
        {
            Text = "Graficadora";
            Size = new Size(800, 600);
            MinimumSize = new Size(600, 450);
            BackColor = ColorPalette.Background;
            ForeColor = ColorPalette.DisplayText;

            // ── Top bar ──────────────────────────────────────────────────────
            var topBar = new Panel
            {
                Dock = DockStyle.Top,
                Height = 84,
                BackColor = Color.FromArgb(32, 32, 32),
                Padding = new Padding(8)
            };

            _fnListPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = false,
                AutoScroll = true,
                BackColor = Color.Transparent
            };

            var inputRow = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 36,
                BackColor = Color.Transparent
            };

            var inputLabel = new Label
            {
                Text = "f(x) =",
                Font = FontSets.Expression,
                ForeColor = ColorPalette.SecondaryText,
                Width = 46,
                TextAlign = ContentAlignment.MiddleRight,
                Location = new Point(4, 6)
            };

            _inputBox = new TextBox
            {
                BackColor = Color.FromArgb(45, 45, 45),
                ForeColor = ColorPalette.DisplayText,
                Font = FontSets.Expression,
                BorderStyle = BorderStyle.FixedSingle,
                Location = new Point(54, 6),
                Width = 260,
                Height = 24
            };
            _inputBox.KeyDown += OnInputKeyDown;

            var addBtn = new CalcButton
            {
                Text = "+ Agregar",
                Role = ButtonRole.ScientificFn,
                Font = FontSets.ButtonSmall,
                ForeColor = Color.White,
                Size = new Size(80, 24),
                Location = new Point(320, 6)
            };
            addBtn.Click += (s, e) => AddFunction();

            var rootBtn = new CalcButton
            {
                Text = "Raíces",
                Role = ButtonRole.Toggle,
                Font = FontSets.ButtonSmall,
                ForeColor = Color.White,
                Size = new Size(70, 24),
                Location = new Point(406, 6)
            };
            rootBtn.Click += (s, e) => ShowRoots();

            var autoBtn = new CalcButton
            {
                Text = "Auto-rango",
                Role = ButtonRole.Default,
                Font = FontSets.ButtonSmall,
                ForeColor = Color.White,
                Size = new Size(80, 24),
                Location = new Point(482, 6)
            };
            autoBtn.Click += (s, e) => AutoRange();

            _errorLabel = new Label
            {
                ForeColor = Color.FromArgb(255, 80, 80),
                BackColor = Color.Transparent,
                Font = FontSets.ButtonSmall,
                AutoSize = true,
                Location = new Point(570, 10)
            };

            inputRow.Controls.Add(inputLabel);
            inputRow.Controls.Add(_inputBox);
            inputRow.Controls.Add(addBtn);
            inputRow.Controls.Add(rootBtn);
            inputRow.Controls.Add(autoBtn);
            inputRow.Controls.Add(_errorLabel);

            topBar.Controls.Add(_fnListPanel);
            topBar.Controls.Add(inputRow);

            // ── Graph panel ──────────────────────────────────────────────────
            _graphPanel = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = ColorPalette.Background
            };
            _graphPanel.Paint += OnGraphPaint;
            _graphPanel.MouseWheel += OnMouseWheel;
            _graphPanel.MouseDown += OnMouseDown;
            _graphPanel.MouseMove += OnMouseMove;
            _graphPanel.MouseUp += OnMouseUp;
            _graphPanel.Resize += (s, e) => _graphPanel.Invalidate();

            Controls.Add(_graphPanel);
            Controls.Add(topBar);
        }

        private void AddFunction()
        {
            string expr = _inputBox.Text.Trim();
            if (string.IsNullOrEmpty(expr)) return;

            // Validate
            try
            {
                double test = Scientific_Calculator.Engine.ExpressionParser.Evaluate(expr, _angleMode, 1.0);
            }
            catch
            {
                _errorLabel.Text = "Expresión inválida";
                return;
            }
            _errorLabel.Text = "";

            var color = _palette[_functions.Count % _palette.Length];
            var entry = new FunctionEntry(expr, color);
            _functions.Add(entry);
            AddFunctionChip(entry);
            _inputBox.Clear();
            _graphPanel.Invalidate();
        }

        private void AddFunctionChip(FunctionEntry entry)
        {
            var chip = new Panel
            {
                BackColor = Color.FromArgb(45, 45, 45),
                Width = 160,
                Height = 28,
                Margin = new Padding(2, 2, 2, 2)
            };

            var colorDot = new Panel
            {
                BackColor = entry.Color,
                Size = new Size(10, 10),
                Location = new Point(6, 9)
            };

            var lbl = new Label
            {
                Text = "f(x)=" + entry.Expression,
                Font = FontSets.ButtonSmall,
                ForeColor = ColorPalette.DisplayText,
                BackColor = Color.Transparent,
                AutoEllipsis = true,
                Width = 112,
                Height = 22,
                Location = new Point(20, 3),
                TextAlign = ContentAlignment.MiddleLeft
            };

            var removeBtn = new Label
            {
                Text = "✕",
                ForeColor = ColorPalette.SecondaryText,
                BackColor = Color.Transparent,
                Font = FontSets.ButtonSmall,
                Size = new Size(20, 20),
                Location = new Point(136, 4),
                TextAlign = ContentAlignment.MiddleCenter,
                Cursor = Cursors.Hand
            };
            removeBtn.Click += (s, ev) =>
            {
                _functions.Remove(entry);
                _fnListPanel.Controls.Remove(chip);
                _graphPanel.Invalidate();
            };

            chip.Controls.Add(colorDot);
            chip.Controls.Add(lbl);
            chip.Controls.Add(removeBtn);
            _fnListPanel.Controls.Add(chip);
        }

        private void OnGraphPaint(object sender, System.Windows.Forms.PaintEventArgs e)
        {
            if (_graphPanel.Width < 1 || _graphPanel.Height < 1) return;
            var bmp = GraphRenderer.Render(_functions, _xMin, _xMax, _yMin, _yMax,
                _graphPanel.Width, _graphPanel.Height, _angleMode);
            e.Graphics.DrawImageUnscaled(bmp, 0, 0);
            bmp.Dispose();
        }

        private void OnMouseWheel(object sender, MouseEventArgs e)
        {
            double factor = e.Delta > 0 ? 0.85 : 1.0 / 0.85;
            double cx = _xMin + (_xMax - _xMin) * e.X / _graphPanel.Width;
            double cy = _yMax - (_yMax - _yMin) * e.Y / _graphPanel.Height;
            _xMin = cx + (_xMin - cx) * factor;
            _xMax = cx + (_xMax - cx) * factor;
            _yMin = cy + (_yMin - cy) * factor;
            _yMax = cy + (_yMax - cy) * factor;
            _graphPanel.Invalidate();
        }

        private void OnMouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button != MouseButtons.Left) return;
            _panning = true;
            _panStart = e.Location;
            _panXMin = _xMin; _panXMax = _xMax;
            _panYMin = _yMin; _panYMax = _yMax;
        }

        private void OnMouseMove(object sender, MouseEventArgs e)
        {
            if (!_panning) return;
            double dx = (_panXMax - _panXMin) * (e.X - _panStart.X) / _graphPanel.Width;
            double dy = (_panYMax - _panYMin) * (e.Y - _panStart.Y) / _graphPanel.Height;
            _xMin = _panXMin - dx;
            _xMax = _panXMax - dx;
            _yMin = _panYMin + dy;
            _yMax = _panYMax + dy;
            _graphPanel.Invalidate();
        }

        private void OnMouseUp(object sender, MouseEventArgs e) => _panning = false;

        private void OnInputKeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter) { AddFunction(); e.SuppressKeyPress = true; }
        }

        private void ShowRoots()
        {
            if (_functions.Count == 0) { MessageBox.Show("No hay funciones.", "Raíces"); return; }
            var lines = new System.Text.StringBuilder();
            foreach (var fn in _functions)
            {
                var roots = GraphRenderer.FindRoots(fn, _xMin, _xMax, _angleMode);
                lines.AppendLine($"f(x) = {fn.Expression}:");
                if (roots.Count == 0) lines.AppendLine("  No se encontraron raíces en el rango visible.");
                else foreach (double r in roots) lines.AppendLine($"  x ≈ {r:G8}");
            }
            MessageBox.Show(lines.ToString(), "Raíces encontradas");
        }

        private void AutoRange()
        {
            _xMin = -10; _xMax = 10; _yMin = -10; _yMax = 10;
            _graphPanel.Invalidate();
        }
    }
}
