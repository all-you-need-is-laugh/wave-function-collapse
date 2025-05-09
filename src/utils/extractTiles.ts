import { TypedEmitter } from 'tiny-typed-emitter';
import { Pixel } from '../entities/Pixel';
import { Tile } from '../entities/Tile';
import { asyncTimeoutLoop } from './asyncTimeoutLoop';

interface ExtractTilesSettings {
  tileSize: number;
  loop: boolean;
  includeFlipped: boolean;
  includeRotated: boolean;
}

export interface TileExtractionProgressEvents {
  rowProcessed: (args: { row: number; totalTiles: number }) => void;
  tileProcessed: (args: { tileIndex: number; totalTiles: number }) => void;
}

export const extractTiles = async (
  imageData: ImageData,
  settings: ExtractTilesSettings,
  eventEmitter?: TypedEmitter<TileExtractionProgressEvents>,
): Promise<Tile[]> => {
  const tiles: Tile[] = [];
  const { data, width, height } = imageData;
  const { tileSize, loop, includeFlipped, includeRotated } = settings;

  const xLimit = loop ? width : width - tileSize + 1;
  const yLimit = loop ? height : height - tileSize + 1;

  const processRow = (y: number) => {
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

          if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
            throw new Error(
              `Invalid pixel data at (${px}, ${py}): ${JSON.stringify({ r, g, b })}`,
            );
          }

          tileData.push(new Pixel(r, g, b));
        }
      }

      const newTile = new Tile(tileSize, tileData);
      const tilesToAdd = [newTile];
      if (includeFlipped) {
        tilesToAdd.push(newTile.flipHorizontally(), newTile.flipVertically());
      }
      if (includeRotated) {
        tilesToAdd.push(newTile.rotate90(), newTile.rotate180(), newTile.rotate270());
      }

      for (const tileToAdd of tilesToAdd) {
        if (!tiles.some(tile => tile.equals(tileToAdd))) {
          tiles.push(tileToAdd);
        }
      }
    }
  };

  await asyncTimeoutLoop(0, yLimit, y => {
    processRow(y);
    if (eventEmitter) {
      eventEmitter.emit('rowProcessed', { row: y, totalTiles: tiles.length });
    }
  });

  await asyncTimeoutLoop(0, tiles.length, i => {
    const tile = tiles[i];

    if (!tile) {
      throw new Error(`Tile at index ${i} is undefined`);
    }

    tile.fillNeighbors(tiles);
    if (eventEmitter) {
      eventEmitter.emit('tileProcessed', { tileIndex: i, totalTiles: tiles.length });
    }
  });

  return tiles;
};
