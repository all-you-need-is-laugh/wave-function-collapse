import { Pixel } from "./Pixel";

interface TileOverlappingParams {
  xAStart: number,
  xBStart: number,
  xLen: number,
  yAStart: number,
  yBStart: number,
  yLen: number
}

export class Tile {

  readonly topNeighbors: Tile[] = [];
  readonly rightNeighbors: Tile[] = [];
  readonly bottomNeighbors: Tile[] = [];
  readonly leftNeighbors: Tile[] = [];

  private _url: string = "";
  
  constructor(
    public readonly size: number,
    public readonly data: Pixel[]
  ) {}

  fillNeighbors(tiles: Tile[]): void {
    this.topNeighbors.length = 0;
    this.rightNeighbors.length = 0;
    this.bottomNeighbors.length = 0;
    this.leftNeighbors.length = 0;
    
    for (const tile of tiles) {
      if (tile === this) {
        continue;
      }

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

  get url(): string {
    if (!this._url) {
      this._url = this._generateUrl();
    }

    return this._url;
  }

  private _generateUrl(): string {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2d context is not supported");
    }

    canvas.width = this.size;
    canvas.height = this.size;

    const imageData = context.createImageData(this.size, this.size);
    const data = imageData.data;

    for (let i = 0; i < this.size * this.size; i++) {
      const pixel = this.data[i];
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
      yLen: Math.ceil(this.size / 2)
    });
  }

  private _checkTilesOverlapFromRight(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: Math.ceil(this.size / 2) - 1,
      xBStart: 0,
      xLen: Math.ceil(this.size / 2),
      yAStart: 0,
      yBStart: 0,
      yLen: this.size
    });
  }

  private _checkTilesOverlapFromBottom(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: 0,
      xBStart: 0,
      xLen: this.size,
      yAStart: Math.ceil(this.size / 2) - 1,
      yBStart: 0,
      yLen: Math.ceil(this.size / 2)
    });
  }

  private _checkTilesOverlapFromLeft(tile: Tile): boolean {
    return this._checkTilesOverlap(tile, {
      xAStart: 0,
      xBStart: Math.ceil(this.size / 2) - 1,
      xLen: Math.ceil(this.size / 2),
      yAStart: 0,
      yBStart: 0,
      yLen: this.size
    });
  }

  private _checkTilesOverlap(tile: Tile, { xAStart, yAStart, xBStart, yBStart, xLen, yLen }: TileOverlappingParams): boolean {
    for (let y = 0; y < yLen; y++) {
      for (let x = 0; x < xLen; x++) {
        const xA = xAStart + x;
        const yA = yAStart + y;
        
        const xB = xBStart + x;
        const yB = yBStart + y;

        const pixelA = this.data[yA * this.size + xA];
        const pixelB = tile.data[yB * this.size + xB];

        if (!pixelA.equals(pixelB)) {
          return false;
        }
      }
    }

    return true;
  }
}
