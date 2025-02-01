import styled from 'styled-components';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

function App() {
  return (
    <Container>
      <InputPanel />
      <OutputPanel />
    </Container >
  )
}

export default App;
