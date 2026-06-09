/**
 * @startingPoint section="Components" subtitle="Calculator key with 7 role variants" viewport="700x260"
 */
export interface CalcButtonProps {
  /** The text displayed on the key (supports Unicode math symbols: √, ×, ÷, π, ⌫) */
  label: string;
  /**
   * Role controls the button's background color group.
   * - `default`    — digit keys (#323232 grey)
   * - `operator`   — +, −, ×, ÷, % (#2d3749 navy)
   * - `scientific` — sin, cos, log, √ etc. (#263241 blue-grey)
   * - `equals`     — = key only (#0067c0 brand blue)
   * - `memory`     — MC, MR, M+, M−, MS (#32263c purple)
   * - `utility`    — C, CE, ⌫ (#3e2828 dark red)
   * - `toggle`     — DEG/RAD, Hist, Graf (same as scientific)
   */
  role?: 'default' | 'operator' | 'scientific' | 'equals' | 'memory' | 'utility' | 'toggle';
  onClick?: () => void;
  disabled?: boolean;
  /** CSS grid column span — use 2 for the "0" key */
  colSpan?: number;
  /** CSS grid row span — use 2 for "+" and "=" keys */
  rowSpan?: number;
  /** Font size preset */
  size?: 'main' | 'sci' | 'sm' | 'large';
  style?: React.CSSProperties;
}
