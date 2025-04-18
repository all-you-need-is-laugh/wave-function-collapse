import { Pixel } from './Pixel';
import { Tile } from './Tile';

export class Cell {
  private readonly options: Tile[] = [];

  collapsed = false;

  constructor(tiles: Tile[]) {
    this.options = [...tiles];
  }

  getOption(index: number): Tile {
    if (this.optionsCount === 0) {
      throw new Error('Cell has no options');
    }

    if (index < 0 || index >= this.optionsCount) {
      throw new Error(`Tile index ${index} out of bounds (0-${this.optionsCount - 1})`);
    }

    const tile = this.options[index];

    if (!tile) {
      throw new Error(`Tile not found at index ${index}`);
    }

    return tile;
  }

  getAllOptions(): Tile[] {
    if (this.optionsCount === 0) {
      throw new Error('Cell has no options');
    }
    return [...this.options];
  }

  get optionsCount(): number {
    return this.options.length;
  }

  resetOptions(tiles: Tile[]): void {
    this.options.splice(0, this.optionsCount, ...tiles);
  }

  collapse(tileIndex: number): void {
    if (this.collapsed) {
      throw new Error('Cell is already collapsed');
    }

    const tile = this.getOption(tileIndex);

    this.resetOptions([tile]);

    this.collapsed = true;
  }

  getCollapsedOption(): Tile {
    if (!this.collapsed) {
      throw new Error('Cell is not collapsed');
    }

    return this.getOption(0);
  }

  getPixel(): Pixel {
    if (this.collapsed) {
      const tile = this.getCollapsedOption();
      return tile.getPixel(Math.floor(tile.size / 2), Math.floor(tile.size / 2));
    }

    const resultingPixel: Pixel = new Pixel(0, 0, 0);

    const len = this.optionsCount;
    for (let i = 0; i < len; i++) {
      const tile = this.getOption(i);
      const pixel = tile.getPixel(Math.floor(tile.size / 2), Math.floor(tile.size / 2));

      resultingPixel.r += pixel.r / len;
      resultingPixel.g += pixel.g / len;
      resultingPixel.b += pixel.b / len;
    }

    return resultingPixel;
  }
}
