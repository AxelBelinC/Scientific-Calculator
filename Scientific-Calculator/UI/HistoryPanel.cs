using System;
using System.Drawing;
using System.Windows.Forms;
using Scientific_Calculator.Engine;
using Scientific_Calculator.Theme;

namespace Scientific_Calculator.UI
{
    public class HistoryPanel : Panel
    {
        private readonly FlowLayoutPanel _flow;
        private readonly Label _title;

        public HistoryPanel()
        {
            BackColor = ColorPalette.HistoryBg;
            Padding = new Padding(0);

            _title = new Label
            {
                Text = "Historial",
                Font = FontSets.HistoryTitle,
                ForeColor = ColorPalette.SecondaryText,
                BackColor = ColorPalette.HistoryBg,
                Dock = DockStyle.Top,
                Height = 36,
                TextAlign = ContentAlignment.MiddleLeft,
                Padding = new Padding(12, 0, 0, 0)
            };

            _flow = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.TopDown,
                WrapContents = false,
                AutoScroll = true,
                BackColor = ColorPalette.HistoryBg,
                Padding = new Padding(6, 4, 6, 4)
            };

            Controls.Add(_flow);
            Controls.Add(_title);
        }

        public void Refresh(System.Collections.Generic.IReadOnlyList<HistoryEntry> history)
        {
            _flow.SuspendLayout();
            _flow.Controls.Clear();

            foreach (var entry in history)
            {
                var item = BuildItem(entry);
                _flow.Controls.Add(item);
            }

            _flow.ResumeLayout();
        }

        private Panel BuildItem(HistoryEntry entry)
        {
            int w = _flow.ClientSize.Width - 16;
            if (w < 10) w = 200;

            var panel = new Panel
            {
                BackColor = ColorPalette.HistoryItem,
                Width = w,
                Height = 52,
                Margin = new Padding(0, 0, 0, 4)
            };

            var exprLbl = new Label
            {
                Text = entry.Expression,
                Font = FontSets.HistoryExpr,
                ForeColor = ColorPalette.SecondaryText,
                BackColor = Color.Transparent,
                AutoSize = false,
                Width = w - 12,
                Height = 22,
                Location = new Point(6, 4),
                TextAlign = ContentAlignment.MiddleRight,
                AutoEllipsis = true
            };

            var resLbl = new Label
            {
                Text = "= " + entry.Result,
                Font = FontSets.HistoryRes,
                ForeColor = ColorPalette.DisplayText,
                BackColor = Color.Transparent,
                AutoSize = false,
                Width = w - 12,
                Height = 24,
                Location = new Point(6, 24),
                TextAlign = ContentAlignment.MiddleRight,
                AutoEllipsis = true
            };

            panel.Controls.Add(exprLbl);
            panel.Controls.Add(resLbl);

            // Resize item width when panel resizes
            _flow.SizeChanged += (s, e) =>
            {
                int nw = _flow.ClientSize.Width - 16;
                if (nw < 10) return;
                panel.Width = nw;
                exprLbl.Width = nw - 12;
                resLbl.Width = nw - 12;
            };

            return panel;
        }
    }
}
