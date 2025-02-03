import { Cell } from "./Cell";

export class Grid {
  private readonly _cells: Cell[] = [];

  constructor(
    public readonly width: number,
    public readonly height: number
  ) { }

  private _index(x: number, y: number): number {
    return y * this.width + x;
  }

  get(x: number, y: number): Cell {
    return this._cells[this._index(x, y)];
  }

  set(x: number, y: number, cell: Cell): void {
    this._cells[this._index(x, y)] = cell;
  }

  fill(callback: (x: number, y: number) => Cell): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.set(x, y, callback(x, y));
      }
    }
  }

  forEach(callback: (cell: Cell, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.get(x, y), x, y);
      }
    }
  }
}
