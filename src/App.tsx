import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { TilesPanel } from './components/TilesPanel';
import { Tile } from './utils/interfaces';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

function App() {
  const [tiles, setTiles] = useState<Tile[]>([]);

  const onTilesExtracted = useCallback((tiles: Tile[]) => {
    setTiles(tiles);
  }, []);

  return (
    <Container>
      <InputPanel onTilesExtracted={onTilesExtracted} />
      <TilesPanel tiles={tiles} />
      <OutputPanel tiles={tiles} />
    </Container >
  )
}

export default App;
