using System;
using System.Drawing;
using System.Windows.Forms;
using Scientific_Calculator.Theme;

namespace Scientific_Calculator.UI
{
    public enum ButtonRole { Default, Operator, ScientificFn, Equals, Memory, Utility, Toggle }

    public class CalcButton : Button
    {
        private bool _isHovered;
        private bool _isPressed;

        public ButtonRole Role { get; set; } = ButtonRole.Default;

        public CalcButton()
        {
            FlatStyle = FlatStyle.Flat;
            FlatAppearance.BorderSize = 0;
            FlatAppearance.MouseDownBackColor = Color.Transparent;
            FlatAppearance.MouseOverBackColor = Color.Transparent;
            UseVisualStyleBackColor = false;
            Cursor = Cursors.Hand;
            TabStop = false;
        }

        private Color BaseColor()
        {
            switch (Role)
            {
                case ButtonRole.Operator:    return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.OperatorHover : ColorPalette.Operator;
                case ButtonRole.ScientificFn:return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.ScientificHov : ColorPalette.ScientificFn;
                case ButtonRole.Equals:      return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.EqualsHover   : ColorPalette.EqualsBtn;
                case ButtonRole.Memory:      return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.MemoryHover   : ColorPalette.Memory;
                case ButtonRole.Utility:     return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.UtilityHover  : ColorPalette.Utility;
                case ButtonRole.Toggle:      return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.ScientificHov : ColorPalette.ScientificFn;
                default:                     return _isPressed ? ColorPalette.ButtonPress : _isHovered ? ColorPalette.ButtonHover   : ColorPalette.ButtonDefault;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            var g = e.Graphics;
            var rect = ClientRectangle;

            using (var brush = new SolidBrush(BaseColor()))
                g.FillRectangle(brush, rect);

            // Subtle rounded look via a 1px border on hover
            if (_isHovered)
            {
                using (var pen = new Pen(Color.FromArgb(80, 255, 255, 255), 1))
                    g.DrawRectangle(pen, 0, 0, rect.Width - 1, rect.Height - 1);
            }

            // Text
            var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
            using (var brush = new SolidBrush(ForeColor))
                g.DrawString(Text, Font, brush, rect, sf);
        }

        protected override void OnMouseEnter(EventArgs e) { _isHovered = true;  Invalidate(); base.OnMouseEnter(e); }
        protected override void OnMouseLeave(EventArgs e) { _isHovered = false; Invalidate(); base.OnMouseLeave(e); }
        protected override void OnMouseDown(MouseEventArgs e) { _isPressed = true;  Invalidate(); base.OnMouseDown(e); }
        protected override void OnMouseUp(MouseEventArgs e)   { _isPressed = false; Invalidate(); base.OnMouseUp(e); }
    }
}
