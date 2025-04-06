import Random from 'prando';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

const StyledFileInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
`;

interface InputPanelProps {
  onImageDataExtracted: (imageData: ImageData) => void;
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
  'Monika',
  'Monika_60',
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

export function InputPanel({ onImageDataExtracted = () => { } }: InputPanelProps) {
  const [selectedImage, setSelectedImage] = useState(random.nextArrayItem(inputOptiopns));
  const [customImage, setCustomImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const imagePath = customImage || imageFullPath(selectedImage);
      const imageData = await readImageData(imagePath);
      onImageDataExtracted(imageData);
    })();
  }, [selectedImage, customImage, onImageDataExtracted]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setCustomImage(fileURL);
    }
  };

  return (
    <InputPanelStyled>
      <h2>1. Select the image</h2>
      <StyledSelect onChange={(e) => { setSelectedImage(e.target.value); setCustomImage(null); }} value={selectedImage}>
        {inputOptiopns.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StyledSelect>
      <div>OR</div>
      <StyledFileInput type="file" accept="image/*" onChange={handleFileChange} />
      <StyledImage src={customImage || imageFullPath(selectedImage)} />
    </InputPanelStyled>
  );
}

