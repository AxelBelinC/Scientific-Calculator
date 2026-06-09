export interface GraphFunction {
  /** A math expression using x, e.g. "sin(x)", "x^2 - 3", "log(abs(x))" */
  expression: string;
  /** Override the auto-assigned graph palette color */
  color?: string;
}

export interface GraphViewProps {
  /** List of functions to plot — each gets a color from the 6-color palette */
  functions?: GraphFunction[];
  width?: number;
  height?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  /** Angle mode for trig functions */
  angleMode?: 'DEG' | 'RAD';
  /** Called when the user pans or zooms — provides the new range */
  onRangeChange?: (range: { xMin: number; xMax: number; yMin: number; yMax: number }) => void;
}
