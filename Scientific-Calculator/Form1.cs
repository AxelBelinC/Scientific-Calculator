using System;
using System.Drawing;
using System.Windows.Forms;
using Scientific_Calculator.Engine;
using Scientific_Calculator.Grapher;
using Scientific_Calculator.Theme;
using Scientific_Calculator.UI;

namespace Scientific_Calculator
{
    public partial class Form1 : Form
    {
        private readonly CalculatorEngine _engine = new CalculatorEngine();
        private HistoryPanel _historyPanel;
        private Label _lblDisplay;
        private Label _lblExpression;
        private CalcButton _btnAngleMode;
        private TableLayoutPanel _mainLayout;
        private bool _historyVisible = true;

        public Form1()
        {
            InitializeComponent();
            BuildUI();
            WireEngine();
        }

        private void BuildUI()
        {
            Text = "Calculadora Científica";
            MinimumSize = new Size(460, 600);
            Size = new Size(730, 650);
            BackColor = ColorPalette.Background;
            ForeColor = ColorPalette.DisplayText;
            KeyPreview = true;
            KeyDown += OnKeyDown;

            _mainLayout = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 2,
                RowCount = 1,
                BackColor = ColorPalette.Background
            };
            _mainLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 400));
            _mainLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
            _mainLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

            var calcPanel = BuildCalcPanel();
            _historyPanel = new HistoryPanel { Dock = DockStyle.Fill };

            _mainLayout.Controls.Add(calcPanel, 0, 0);
            _mainLayout.Controls.Add(_historyPanel, 1, 0);
            Controls.Add(_mainLayout);
        }

        private Panel BuildCalcPanel()
        {
            var panel = new Panel { Dock = DockStyle.Fill, BackColor = ColorPalette.Background };

            var layout = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 1,
                RowCount = 6,
                BackColor = ColorPalette.Background
            };
            layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 28));
            layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 28));
            layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 72));
            layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
            layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 160));
            layout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

            layout.Controls.Add(BuildModeRow(), 0, 0);
            layout.Controls.Add(BuildExpressionLabel(), 0, 1);
            layout.Controls.Add(BuildDisplayLabel(), 0, 2);
            layout.Controls.Add(BuildMemoryRow(), 0, 3);
            layout.Controls.Add(BuildScientificGrid(), 0, 4);
            layout.Controls.Add(BuildNumpad(), 0, 5);

            panel.Controls.Add(layout);
            return panel;
        }

        private Panel BuildModeRow()
        {
            var row = new Panel { Dock = DockStyle.Fill, BackColor = ColorPalette.Background };

            _btnAngleMode = MakeBtn("DEG", ButtonRole.Toggle, FontSets.ModeToggle);
            _btnAngleMode.Size = new Size(50, 22);
            _btnAngleMode.Anchor = AnchorStyles.Right | AnchorStyles.Top;
            _btnAngleMode.Click += (s, e) => _engine.ToggleAngleMode();

            var grafBtn = MakeBtn("Graf", ButtonRole.ScientificFn, FontSets.ModeToggle);
            grafBtn.Size = new Size(46, 22);
            grafBtn.Anchor = AnchorStyles.Right | AnchorStyles.Top;
            grafBtn.Click += (s, e) => new FormGrapher(_engine.AngleMode).Show();

            var histBtn = MakeBtn("Hist", ButtonRole.Toggle, FontSets.ModeToggle);
            histBtn.Size = new Size(46, 22);
            histBtn.Anchor = AnchorStyles.Right | AnchorStyles.Top;
            histBtn.Click += (s, e) => ToggleHistory();

            RepositionModeButtons(row, _btnAngleMode, grafBtn, histBtn);
            row.Resize += (s, e) => RepositionModeButtons(row, _btnAngleMode, grafBtn, histBtn);

            row.Controls.Add(histBtn);
            row.Controls.Add(grafBtn);
            row.Controls.Add(_btnAngleMode);
            return row;
        }

        private static void RepositionModeButtons(Panel row, CalcButton deg, CalcButton graf, CalcButton hist)
        {
            deg.Location  = new Point(row.Width - 56,  3);
            graf.Location = new Point(row.Width - 108, 3);
            hist.Location = new Point(row.Width - 160, 3);
        }

        private Label BuildExpressionLabel()
        {
            _lblExpression = new Label
            {
                Dock = DockStyle.Fill,
                Text = "",
                Font = FontSets.Expression,
                ForeColor = ColorPalette.SecondaryText,
                BackColor = ColorPalette.DisplayBg,
                TextAlign = ContentAlignment.MiddleRight,
                Padding = new Padding(0, 0, 10, 0)
            };
            return _lblExpression;
        }

        private Label BuildDisplayLabel()
        {
            _lblDisplay = new Label
            {
                Dock = DockStyle.Fill,
                Text = "0",
                Font = FontSets.Display,
                ForeColor = ColorPalette.DisplayText,
                BackColor = ColorPalette.DisplayBg,
                TextAlign = ContentAlignment.MiddleRight,
                Padding = new Padding(0, 0, 10, 0),
                AutoEllipsis = true
            };
            return _lblDisplay;
        }

        private Panel BuildMemoryRow()
        {
            var row = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 5,
                RowCount = 1,
                BackColor = ColorPalette.Background
            };
            for (int i = 0; i < 5; i++) row.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 20));
            row.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

            AddBtn(row, "MC", ButtonRole.Memory, 0, 0, (s, e) => _engine.MemoryClear());
            AddBtn(row, "MR", ButtonRole.Memory, 1, 0, (s, e) => _engine.MemoryRecall());
            AddBtn(row, "M+", ButtonRole.Memory, 2, 0, (s, e) => _engine.MemoryAdd());
            AddBtn(row, "M−", ButtonRole.Memory, 3, 0, (s, e) => _engine.MemorySubtract());
            AddBtn(row, "MS", ButtonRole.Memory, 4, 0, (s, e) => _engine.MemoryStore());
            return row;
        }

        private Panel BuildScientificGrid()
        {
            var grid = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 6,
                RowCount = 3,
                BackColor = ColorPalette.Background
            };
            for (int i = 0; i < 6; i++) grid.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100f / 6));
            for (int i = 0; i < 3; i++) grid.RowStyles.Add(new RowStyle(SizeType.Percent, 100f / 3));

            int col = 0, row = 0;
            void Sci(string label, Action act)
            {
                AddBtn(grid, label, ButtonRole.ScientificFn, col++, row, (s, e) => act());
                if (col >= 6) { col = 0; row++; }
            }

            Sci("sin",     () => _engine.InputFunction("sin"));
            Sci("cos",     () => _engine.InputFunction("cos"));
            Sci("tan",     () => _engine.InputFunction("tan"));
            Sci("sin⁻¹",   () => _engine.InputFunction("asin"));
            Sci("cos⁻¹",   () => _engine.InputFunction("acos"));
            Sci("tan⁻¹",   () => _engine.InputFunction("atan"));

            Sci("log",     () => _engine.InputFunction("log"));
            Sci("ln",      () => _engine.InputFunction("ln"));
            Sci("10^x",    () => _engine.InputFunction("10x"));
            Sci("e^x",     () => _engine.InputFunction("ex"));
            Sci("√",       () => _engine.InputFunction("sqrt"));
            Sci("∛",       () => _engine.InputFunction("cbrt"));

            Sci("x²",      () => _engine.InputFunction("x2"));
            Sci("x³",      () => _engine.InputFunction("x3"));
            Sci("xⁿ",      () => _engine.InputFunction("pow"));
            Sci("x^(1/n)", () => _engine.InputFunction("nthroot"));
            Sci("1/x",     () => _engine.InputFunction("1x"));
            Sci("n!",      () => _engine.InputFunction("fact"));

            return grid;
        }

        private Panel BuildNumpad()
        {
            var grid = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 5,
                RowCount = 6,
                BackColor = ColorPalette.Background
            };
            for (int i = 0; i < 5; i++) grid.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 20));
            for (int i = 0; i < 6; i++) grid.RowStyles.Add(new RowStyle(SizeType.Percent, 100f / 6));

            // Row 0
            AddBtn(grid, "C",    ButtonRole.Utility,      0, 0, (s, e) => _engine.Clear());
            AddBtn(grid, "CE",   ButtonRole.Utility,      1, 0, (s, e) => _engine.ClearEntry());
            AddBtn(grid, "⌫",   ButtonRole.Utility,      2, 0, (s, e) => _engine.Backspace());
            AddBtn(grid, "nCr",  ButtonRole.ScientificFn, 3, 0, (s, e) => _engine.InputFunction("ncr"));
            AddBtn(grid, "nPr",  ButtonRole.ScientificFn, 4, 0, (s, e) => _engine.InputFunction("npr"));

            // Row 1
            AddBtn(grid, "(",    ButtonRole.ScientificFn, 0, 1, (s, e) => _engine.InputParenthesis('('));
            AddBtn(grid, ")",    ButtonRole.ScientificFn, 1, 1, (s, e) => _engine.InputParenthesis(')'));
            AddBtn(grid, "%",    ButtonRole.Operator,     2, 1, (s, e) => _engine.InputOperator("%"));
            AddBtn(grid, "π",    ButtonRole.ScientificFn, 3, 1, (s, e) => _engine.InputConstant("pi"));
            AddBtn(grid, "÷",    ButtonRole.Operator,     4, 1, (s, e) => _engine.InputOperator("/"));

            // Row 2
            AddBtn(grid, "7",    ButtonRole.Default,      0, 2, (s, e) => _engine.InputDigit('7'));
            AddBtn(grid, "8",    ButtonRole.Default,      1, 2, (s, e) => _engine.InputDigit('8'));
            AddBtn(grid, "9",    ButtonRole.Default,      2, 2, (s, e) => _engine.InputDigit('9'));
            AddBtn(grid, "e",    ButtonRole.ScientificFn, 3, 2, (s, e) => _engine.InputConstant("e"));
            AddBtn(grid, "×",    ButtonRole.Operator,     4, 2, (s, e) => _engine.InputOperator("*"));

            // Row 3
            AddBtn(grid, "4",    ButtonRole.Default,      0, 3, (s, e) => _engine.InputDigit('4'));
            AddBtn(grid, "5",    ButtonRole.Default,      1, 3, (s, e) => _engine.InputDigit('5'));
            AddBtn(grid, "6",    ButtonRole.Default,      2, 3, (s, e) => _engine.InputDigit('6'));
            AddBtn(grid, "+/-",  ButtonRole.Default,      3, 3, (s, e) => _engine.ToggleSign());
            AddBtn(grid, "−",    ButtonRole.Operator,     4, 3, (s, e) => _engine.InputOperator("-"));

            // Row 4
            AddBtn(grid, "1",    ButtonRole.Default,      0, 4, (s, e) => _engine.InputDigit('1'));
            AddBtn(grid, "2",    ButtonRole.Default,      1, 4, (s, e) => _engine.InputDigit('2'));
            AddBtn(grid, "3",    ButtonRole.Default,      2, 4, (s, e) => _engine.InputDigit('3'));
            AddBtn(grid, "+",    ButtonRole.Operator,     3, 4, (s, e) => _engine.InputOperator("+"));

            // "+" spans 2 rows (rows 4 and 5)
            grid.SetRowSpan(grid.GetControlFromPosition(3, 4), 2);

            // Row 5
            AddBtn(grid, "0",    ButtonRole.Default,      0, 5, (s, e) => _engine.InputDigit('0'));
            grid.SetColumnSpan(grid.GetControlFromPosition(0, 5), 2);

            AddBtn(grid, ".",    ButtonRole.Default,      2, 5, (s, e) => _engine.InputDecimal());

            var eqBtn = MakeBtn("=", ButtonRole.Equals, FontSets.ButtonMain);
            eqBtn.Click += (s, e) => _engine.InputEquals();
            grid.Controls.Add(eqBtn);
            grid.SetCellPosition(eqBtn, new TableLayoutPanelCellPosition(4, 4));
            grid.SetRowSpan(eqBtn, 2);

            return grid;
        }

        // ── Engine wiring ─────────────────────────────────────────────────────
        private void WireEngine()
        {
            _engine.DisplayChanged += (s, e) =>
            {
                _lblDisplay.Text = _engine.DisplayValue;
                _lblExpression.Text = _engine.ExpressionDisplay;
            };
            _engine.HistoryChanged += (s, e) => _historyPanel.Refresh(_engine.History);
            _engine.AngleModeChanged += (s, e) =>
                _btnAngleMode.Text = _engine.AngleMode == AngleMode.Degrees ? "DEG" : "RAD";
        }

        // ── Keyboard ──────────────────────────────────────────────────────────
        private void OnKeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.D0: case Keys.NumPad0: _engine.InputDigit('0'); break;
                case Keys.D1: case Keys.NumPad1: _engine.InputDigit('1'); break;
                case Keys.D2: case Keys.NumPad2: _engine.InputDigit('2'); break;
                case Keys.D3: case Keys.NumPad3: _engine.InputDigit('3'); break;
                case Keys.D4: case Keys.NumPad4: _engine.InputDigit('4'); break;
                case Keys.D5: case Keys.NumPad5: _engine.InputDigit('5'); break;
                case Keys.D6: case Keys.NumPad6: _engine.InputDigit('6'); break;
                case Keys.D7: case Keys.NumPad7: _engine.InputDigit('7'); break;
                case Keys.D8: case Keys.NumPad8: _engine.InputDigit('8'); break;
                case Keys.D9: case Keys.NumPad9: _engine.InputDigit('9'); break;
                case Keys.Add:      _engine.InputOperator("+"); break;
                case Keys.Subtract: _engine.InputOperator("-"); break;
                case Keys.Multiply: _engine.InputOperator("*"); break;
                case Keys.Divide:   _engine.InputOperator("/"); break;
                case Keys.Enter:    _engine.InputEquals(); break;
                case Keys.Back:     _engine.Backspace(); break;
                case Keys.Escape:   _engine.Clear(); break;
                case Keys.Delete:   _engine.ClearEntry(); break;
                case Keys.Decimal: case Keys.OemPeriod:
                    _engine.InputDecimal(); break;
            }
            if (e.KeyCode == Keys.D5 && e.Shift) _engine.InputOperator("%");
        }

        private void ToggleHistory()
        {
            _historyVisible = !_historyVisible;
            _historyPanel.Visible = _historyVisible;
            _mainLayout.ColumnStyles[1] = _historyVisible
                ? new ColumnStyle(SizeType.Percent, 100)
                : new ColumnStyle(SizeType.Absolute, 0);
        }

        // ── Button helpers ────────────────────────────────────────────────────
        private static CalcButton MakeBtn(string text, ButtonRole role, Font font)
        {
            return new CalcButton
            {
                Text = text,
                Role = role,
                Font = font,
                ForeColor = Color.White,
                Dock = DockStyle.Fill,
                Margin = new Padding(1)
            };
        }

        private static void AddBtn(TableLayoutPanel grid, string text, ButtonRole role,
            int col, int row, EventHandler click)
        {
            var btn = MakeBtn(text, role,
                role == ButtonRole.ScientificFn || role == ButtonRole.Memory || role == ButtonRole.Toggle
                    ? FontSets.ButtonSci
                    : FontSets.ButtonMain);
            btn.Click += click;
            grid.Controls.Add(btn);
            grid.SetCellPosition(btn, new TableLayoutPanelCellPosition(col, row));
        }
    }
}
