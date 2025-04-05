import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import Panel from './Panel';
import { WFCExecutionArea } from './WFCExecutionArea';

const OutputPanelStyled = styled(Panel)`
  background-color: lightgreen;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200%;
`;

const Loader = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #555;
`;

interface OutputPanelProps {
  tiles: Tile[];
}

export function OutputPanel({ tiles }: OutputPanelProps) {
  return (
    <OutputPanelStyled>
      <h2>Output</h2>
      {
        tiles.length === 0 ? (
          <Loader>Loading...</Loader>
        ) : (
          <WFCExecutionArea tiles={tiles} />
        )
      }
    </OutputPanelStyled >
  );
}

// Remove WFCExecutionArea component and its related code

