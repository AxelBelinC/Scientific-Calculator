export interface DisplayProps {
  /** The primary result shown large — defaults to "0" */
  value?: string;
  /** The expression above the result (e.g. "sin(30) =") — empty string hides it */
  expression?: string;
  /** Current angle mode label shown for context — "DEG" or "RAD" */
  angleMode?: 'DEG' | 'RAD';
}
