import { Pixel, Tile } from './interfaces';

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

          tileData.push({ r, g, b });
        }
      }

      tiles.push({
        size: tileSize,
        data: tileData,
      });
    }
  }

  return tiles;
}
