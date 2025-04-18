import { Pixel } from './Pixel';

interface TileOverlappingParams {
  xAStart: number;
  xBStart: number;
  xLen: number;
  yAStart: number;
  yBStart: number;
  yLen: number;
}

export class Tile {
  readonly topNeighbors: Tile[] = [];
  readonly rightNeighbors: Tile[] = [];
  readonly bottomNeighbors: Tile[] = [];
  readonly leftNeighbors: Tile[] = [];

  private _url = '';

  constructor(
    public readonly size: number,
    private readonly pixels: Pixel[],
  ) {
    if (pixels.length !== size ** 2) {
      throw new Error('Pixels length must be equal to size squared');
    }
  }

  getIndex(x: number, y: number): number {
    return x + y * this.size;
  }

  protected getPixelByIndex(index: number): Pixel {
    if (index < 0 || index >= this.pixels.length) {
      throw new Error(`Pixel index ${index} out of bounds (0-${this.pixels.length - 1})`);
    }

    const pixel = this.pixels[index];

    if (!pixel) {
      throw new Error(`Pixel at index ${index} is undefined`);
    }

    return pixel;
  }

  getPixel(x: number, y: number): Pixel {
    const index = this.getIndex(x, y);
    return this.getPixelByIndex(index);
  }

  fillNeighbors(tiles: Tile[]): void {
    this.topNeighbors.length = 0;
    this.rightNeighbors.length = 0;
    this.bottomNeighbors.length = 0;
    this.leftNeighbors.length = 0;

    for (const tile of tiles) {
      if (this._checkTilesOverlapFromTop(tile)) {
        this.topNeighbors.push(tile);
      }

      if (this._checkTilesOverlapFromRight(tile)) {
        this.rightNeighbors.push(tile);
      }

      if (this._checkTilesOverlapFromBottom(tile)) {
        this.bottomNeighbors.push(tile);
      }

      if (this._checkTilesOverlapFromLeft(tile)) {
        this.leftNeighbors.push(tile);
      }
    }
  }

  equals(tile: Tile): boolean {
    return this.pixels.every((pixel, index) => pixel.equals(tile.getPixelByIndex(index)));
  }

  get url(): string {
    if (!this._url) {
      this._url = this._generateUrl();
    }

    return this._url;
  }

  flipHorizontally(): Tile {
    const flippedData: Pixel[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        flippedData.push(this.getPixel(this.size - 1 - x, y));
      }
    }
    return new Tile(this.size, flippedData);
  }

  flipVertically(): Tile {
    const flippedData: Pixel[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        flippedData.push(this.getPixel(x, this.size - 1 - y));
      }
    }
    return new Tile(this.size, flippedData);
  }

  rotate90(): Tile {
    const rotatedData: Pixel[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        rotatedData.push(this.getPixel(y, this.size - 1 - x));
      }
    }
    return new Tile(this.size, rotatedData);
  }

  rotate180(): Tile {
    const rotatedData: Pixel[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        rotatedData.push(this.getPixel(this.size - 1 - x, this.size - 1 - y));
      }
    }
    return new Tile(this.size, rotatedData);
  }

  rotate270(): Tile {
    const rotatedData: Pixel[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        rotatedData.push(this.getPixel(this.size - 1 - y, x));
      }
    }
    return new Tile(this.size, rotatedData);
  }

  private _generateUrl(): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas 2d context is not supported');
    }

    canvas.width = this.size;
    canvas.height = this.size;

    const imageData = context.createImageData(this.size, this.size);
    const data = imageData.data;

    for (let i = 0; i < this.size * this.size; i++) {
      const pixel = this.getPixelByIndex(i);
      const j = i * 4;

      data[j] = pixel.r;
      data[j + 1] = pixel.g;
      data[j + 2] = pixel.b;
      data[j + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  }

  private _checkTilesOverlapFromTop(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: 0,
      xBStart: 0,
      xLen: this.size,
      yAStart: 0,
      yBStart: Math.ceil(this.size / 2) - 1,
      yLen: Math.ceil(this.size / 2),
    });
  }

  private _checkTilesOverlapFromRight(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: Math.ceil(this.size / 2) - 1,
      xBStart: 0,
      xLen: Math.ceil(this.size / 2),
      yAStart: 0,
      yBStart: 0,
      yLen: this.size,
    });
  }

  private _checkTilesOverlapFromBottom(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: 0,
      xBStart: 0,
      xLen: this.size,
      yAStart: Math.ceil(this.size / 2) - 1,
      yBStart: 0,
      yLen: Math.ceil(this.size / 2),
    });
  }

  private _checkTilesOverlapFromLeft(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: 0,
      xBStart: Math.ceil(this.size / 2) - 1,
      xLen: Math.ceil(this.size / 2),
      yAStart: 0,
      yBStart: 0,
      yLen: this.size,
    });
  }

  private _checkTilesOverlap(
    tile: Tile,
    { xAStart, yAStart, xBStart, yBStart, xLen, yLen }: TileOverlappingParams,
  ): boolean {
    for (let y = 0; y < yLen; y++) {
      for (let x = 0; x < xLen; x++) {
        const xA = xAStart + x;
        const yA = yAStart + y;

        const xB = xBStart + x;
        const yB = yBStart + y;

        const pixelA = this.getPixel(xA, yA);
        const pixelB = tile.getPixel(xB, yB);

        if (!pixelA.equals(pixelB)) {
          return false;
        }
      }
    }

    return true;
  }
}
