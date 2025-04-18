import { Tile } from '../entities/Tile';

export const consoleImage = (url: string, label = '', size = 6): void => {
  // const image = new Image();
  // image.src = url;

  // image.onload = () => {
  const style = [
    // 'font-size: 1px;',
    `padding: ${size}px ${size}px;`,
    'background: url(' + url + ') no-repeat;',
    'background-size: contain;',
    'image-rendering: pixelated;',
  ].join(' ');
  console.log('%c %s %s', style, ' '.repeat(size / 2), label);
  // };
};

export const consoleTile = (tile: Tile, label = ''): void => {
  consoleImage(tile.url, label);
};
