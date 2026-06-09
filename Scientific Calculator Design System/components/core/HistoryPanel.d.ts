export interface HistoryEntry {
  /** The expression string, e.g. "sin(30)" or "6 × 7" */
  expression: string;
  /** The formatted result string, e.g. "0.5" or "42" */
  result: string;
}

export interface HistoryPanelProps {
  /** Array of history entries, most recent first */
  entries?: HistoryEntry[];
  /** Whether the panel is rendered — mirrors the Hist toggle button */
  visible?: boolean;
}
