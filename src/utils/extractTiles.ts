import { Pixel } from '../entities/Pixel';
import { Tile } from '../entities/Tile';

export const extractTiles = ({ data, height, width}: ImageData, tileSize: number, loop = true): Tile[] => {
  const tiles: Tile[] = [];

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

      if (!tiles.some(tile => tile.equals(newTile))) {
        tiles.push(newTile);
      }
    }
  }

  for (const tile of tiles) {
    tile.fillNeighbors(tiles);
  }

  return tiles;
}
