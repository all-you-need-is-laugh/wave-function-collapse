import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { TilesPanel } from './components/TilesPanel';
import { Tile } from './entities/Tile';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);

  const onImageDataExtracted = useCallback((data: ImageData) => {
    setImageData(data);
  }, []);

  const onTilesExtracted = useCallback((extractedTiles: Tile[]) => {
    setTiles(extractedTiles);
  }, []);

  return (
    <Container>
      <InputPanel onImageDataExtracted={onImageDataExtracted} />
      <TilesPanel imageData={imageData} onTilesExtracted={onTilesExtracted} />
      <OutputPanel tiles={tiles} />
    </Container>
  );
}

export default App;
