import { Pixel } from '../entities/Pixel';
import { Tile } from '../entities/Tile';

export const extractTiles = ({ data, height, width }: ImageData, settings: { tileSize: number, loop: boolean, includeFlipped: boolean, includeRotated: boolean }): Tile[] => {
  const tiles: Tile[] = [];
  const { tileSize, loop, includeFlipped, includeRotated } = settings;

  const xLimit = loop ? width : width - tileSize + 1;
  const yLimit = loop ? height : height - tileSize + 1;

  for (let y = 0; y < yLimit; y++) {
    for (let x = 0; x < xLimit; x++) {
      const tileData: Pixel[] = [];

      for (let ty = 0; ty < tileSize; ty++) {
        for (let tx = 0; tx < tileSize; tx++) {
          const px = (x + tx) % width;
          const py = (y + ty) % height;

          const pixelIndex = py * width + px;
          const r = data[pixelIndex * 4];
          const g = data[pixelIndex * 4 + 1];
          const b = data[pixelIndex * 4 + 2];

          tileData.push(new Pixel(r, g, b));
        }
      }

      const newTile = new Tile(tileSize, tileData);

      if (tiles.some(tile => tile.equals(newTile))) {
        continue;
      }

      tiles.push(newTile);

      if (includeFlipped) {
        const flippedTiles = [
          newTile.flipHorizontally(),
          newTile.flipVertically()
        ];

        for (const flippedTile of flippedTiles) {
          if (!tiles.some(tile => tile.equals(flippedTile))) {
            tiles.push(flippedTile);
          }
        }
      }

      if (includeRotated) {
        const rotatedTiles = [
          newTile.rotate90(),
          newTile.rotate180(),
          newTile.rotate270()
        ];

        for (const rotatedTile of rotatedTiles) {
          if (!tiles.some(tile => tile.equals(rotatedTile))) {
            tiles.push(rotatedTile);
          }
        }
      }
    }
  }

  for (const tile of tiles) {
    tile.fillNeighbors(tiles);
  }

  return tiles;
}
