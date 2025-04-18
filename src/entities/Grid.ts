import { Cell } from './Cell';

export class Grid {
  private readonly _cells: Cell[] = [];

  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {}

  private _index(x: number, y: number): number {
    return y * this.width + x;
  }

  get(x: number, y: number): Cell {
    const cell = this._cells[this._index(x, y)];
    if (!cell) {
      throw new Error(`Cell at (${x}, ${y}) is undefined`);
    }
    return cell;
  }

  set(x: number, y: number, cell: Cell): void {
    this._cells[this._index(x, y)] = cell;
  }

  getCoordinates(targetCell: Cell): { x: number; y: number } {
    let result: { x: number; y: number } | undefined;

    this.forEach((cell, x, y) => {
      if (targetCell === cell) {
        result = { x, y };
        return false;
      }
    });

    if (!result) {
      throw new Error('Cell not found');
    }

    return result;
  }

  fill(callback: (x: number, y: number) => Cell): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.set(x, y, callback(x, y));
      }
    }
  }

  forEach(callback: (cell: Cell, x: number, y: number) => boolean | void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const result = callback(this.get(x, y), x, y);

        // stop iteration if callback returns false
        if (result === false) {
          return;
        }
      }
    }
  }
}
