
export interface RouletteItem {
  id: string;
  text: string;
  color: string;
}

export interface SpinResult {
  item: RouletteItem;
  angle: number;
}
