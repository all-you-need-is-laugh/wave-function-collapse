import { Pixel } from "./Pixel";
import { Tile } from "./Tile";

export class Cell {
  readonly options: Tile[];

  collapsed = false;

  constructor(
    tiles: Tile[]
  ) {
    this.options = [...tiles];
  }

  getCollapsedTile(): Tile {
    if (this.collapsed) {
      return this.options[0];
    }

    throw new Error('Cell is not collapsed');
  }

  getPixel(): Pixel {
    if (this.collapsed) {
      const tile = this.options[0];
      return tile.data[Math.floor(tile.data.length / 2)];
    }

    const resultingPixel: Pixel = new Pixel(0, 0, 0);

    const len = this.options.length;
    for (let i = 0; i < len; i++) {
      const tile = this.options[i];
      const pixel = tile.data[Math.floor(tile.data.length / 2)];

      resultingPixel.r += pixel.r / len;
      resultingPixel.g += pixel.g / len;
      resultingPixel.b += pixel.b / len;
    }

    return resultingPixel;
  }

}
