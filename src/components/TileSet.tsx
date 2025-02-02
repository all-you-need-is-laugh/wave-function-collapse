import { useEffect, useRef } from 'react';
import { Tile } from '../entities/Tile';

interface TileSetProps {
  tiles: Tile[];
}

const TileSet = ({ tiles }: TileSetProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!tiles.length) {
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const pixelSize = 10;
        const columns = Math.min(10, Math.ceil(Math.sqrt(tiles.length)));
        const rows = Math.ceil(tiles.length / columns);
        const tileSize = tiles[0].size * pixelSize;
        canvas.width = columns * tileSize;
        canvas.height = rows * tileSize;

        tiles.forEach((tile, tileIndex) => {
          const xOffset = (tileIndex % columns) * tileSize;
          const yOffset = Math.floor(tileIndex / columns) * tileSize;

          tile.data.forEach((pixel, index) => {
            const x = (index % tile.size) * pixelSize + xOffset;
            const y = Math.floor(index / tile.size) * pixelSize + yOffset;
            context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
            context.fillRect(x, y, pixelSize, pixelSize);
          });

          // Draw dotted border around each tile
          context.strokeStyle = 'black';
          context.setLineDash([5, 5]);
          context.strokeRect(xOffset, yOffset, tileSize, tileSize);
        });
      }
    }
  }, [tiles]);

  return <canvas ref={canvasRef} />;
};

export default TileSet;
