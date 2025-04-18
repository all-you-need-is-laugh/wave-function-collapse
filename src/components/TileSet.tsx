import { useEffect, useRef } from 'react';
import { Tile } from '../entities/Tile';

interface TileSetProps {
  tiles: Tile[];
}

const MAX_COLUMNS = 12;

const TileSet = ({ tiles }: TileSetProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const firstTile = tiles[0];
    if (!firstTile) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const pixelSize = 10;
    const columns = Math.min(MAX_COLUMNS, Math.ceil(Math.sqrt(tiles.length)));
    const rows = Math.ceil(tiles.length / columns);
    const tileSize = firstTile.size * pixelSize;
    canvas.width = columns * tileSize;
    canvas.height = rows * tileSize;

    tiles.forEach((tile, tileIndex) => {
      const xOffset = (tileIndex % columns) * tileSize;
      const yOffset = Math.floor(tileIndex / columns) * tileSize;

      for (let y = 0; y < tile.size; y++) {
        for (let x = 0; x < tile.size; x++) {
          const pixel = tile.getPixel(x, y);
          context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
          context.fillRect(
            x * pixelSize + xOffset,
            y * pixelSize + yOffset,
            pixelSize,
            pixelSize,
          );
        }
      }

      // Draw dotted border around each tile
      context.strokeStyle = 'black';
      context.setLineDash([5, 5]);
      context.strokeRect(xOffset, yOffset, tileSize, tileSize);
    });
  }, [tiles]);

  return <canvas ref={canvasRef} />;
};

export default TileSet;
