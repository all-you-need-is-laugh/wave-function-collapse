import { useCallback } from 'react';
import styled from 'styled-components';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Tile } from './utils/interfaces';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

function App() {
  const onTilesExtracted = useCallback((tiles: Tile[]) => {
    console.warn("### > onTilesExtracted > tiles:", tiles);
  }, []);

  return (
    <Container>
      <InputPanel onTilesExtracted={onTilesExtracted} />
      <OutputPanel />
    </Container >
  )
}

export default App;
