import { Tile } from '../entities/Tile';
import { Pixel } from './Pixel';

const areTilesEqual = (tile1: Tile, tile2: Tile): boolean => {
  return tile1.data.every((pixel, index) => 
    pixel.r === tile2.data[index].r &&
    pixel.g === tile2.data[index].g &&
    pixel.b === tile2.data[index].b
  );
};

export const extractTiles = ({ data, height, width}: ImageData, tileSize: number): Tile[] => {
  const tiles: Tile[] = [];

  for (let y = 0; y < height - tileSize + 1; y++) {
    for (let x = 0; x < width - tileSize + 1; x++) {
      const tileData: Pixel[] = [];

      for (let ty = 0; ty < tileSize; ty++) {
        for (let tx = 0; tx < tileSize; tx++) {
          const pixelIndex = (y + ty) * width + (x + tx);
          const r = data[pixelIndex * 4];
          const g = data[pixelIndex * 4 + 1];
          const b = data[pixelIndex * 4 + 2];

          tileData.push(new Pixel(r, g, b ));
        }
      }

      const newTile = new Tile(tileSize, tileData);

      if (!tiles.some(tile => areTilesEqual(tile, newTile))) {
        tiles.push(newTile);
      }
    }
  }

  for (const tile of tiles) {
    tile.fillNeighbors(tiles);
  }

  return tiles;
}
