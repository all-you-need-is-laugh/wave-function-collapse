import Random from 'prando';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import { extractTiles } from '../utils/extractTiles';
import { readImageData } from '../utils/readImageData';
import Panel from './Panel';

const random = new Random();

const InputPanelStyled = styled(Panel)`
  background-color: lightblue;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: cover;
  image-rendering: pixelated;
`;

const StyledSelect = styled.select`
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
`;

interface InputPanelProps {
  onTilesExtracted: (tiles: Tile[]) => void;
}

const inputOptiopns = [
  '3Bricks',
  'Angular',
  'BrownFox',
  'Cat',
  'Cats',
  'Cave',
  'Chess',
  'Circle',
  'City',
  'ColoredCity',
  'Disk',
  'Dungeon',
  'Fabric',
  'Flowers',
  'Font',
  'Forest',
  'Hogs',
  'Knot',
  'Lake',
  'LessRooms',
  'Lines',
  'Link',
  'Link2',
  'MagicOffice',
  'Maze',
  'Mazelike',
  'MoreFlowers',
  'Mountains',
  'Nested',
  'NotKnot',
  'Office',
  'Office2',
  'Paths',
  'Platformer',
  'Qud',
  'RedDot',
  'RedMaze',
  'Rooms',
  'Rule126',
  'Sand',
  'ScaledMaze',
  'Sewers',
  'SimpleKnot',
  'SimpleMaze',
  'SimpleWall',
  'Skew1',
  'Skew2',
  'Skyline',
  'Skyline2',
  'SmileCity',
  'Spirals',
  'Town',
  'TrickKnot',
  'Village',
  'Wall',
  'WalledDot',
  'Water',
  'Wrinkles',
];

function imageFullPath(selectedImage: string): string {
  return `./samples/${selectedImage}.png`;
}

export function InputPanel({ onTilesExtracted = () => { } }: InputPanelProps) {
  const [selectedImage, setSelectedImage] = useState(random.nextArrayItem(inputOptiopns));

  useEffect(() => {
    (async () => {
      const imageData = await readImageData(imageFullPath(selectedImage));
      const tiles = extractTiles(imageData, 3);

      onTilesExtracted(tiles);
    })();
  }, [selectedImage, onTilesExtracted]);

  return (
    <InputPanelStyled>
      <h2>Input</h2>
      <StyledSelect onChange={(e) => setSelectedImage(e.target.value)} value={selectedImage}>
        {inputOptiopns.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StyledSelect>
      <StyledImage src={imageFullPath(selectedImage)} />
    </InputPanelStyled>
  )
}

