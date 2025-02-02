import { useEffect } from 'react';
import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import { extractTiles } from '../utils/extractTiles';
import { readImageData } from '../utils/readImageData';
import Panel from './Panel';

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

interface InputPanelProps {
  onTilesExtracted: (tiles: Tile[]) => void;
}

export function InputPanel({ onTilesExtracted = () => { } }: InputPanelProps) {
  const imageSrc = 'samples/City.png';

  useEffect(() => {
    (async () => {
      const imageData = await readImageData(imageSrc);
      const tiles = extractTiles(imageData, 3);

      onTilesExtracted(tiles);
    })();
  }, [imageSrc, onTilesExtracted]);

  return (
    <InputPanelStyled>
      <h2>Input</h2>
      <StyledImage src={imageSrc} />
    </InputPanelStyled>
  )
}
