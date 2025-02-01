export interface Pixel {
  r: number;
  g: number;
  b: number;
}

export interface Tile {
  size: number;
  data: Pixel[];
}
