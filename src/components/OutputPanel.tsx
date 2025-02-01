import { useCallback } from 'react';
import styled from 'styled-components';
import { useIntervalExecution } from '../hooks/useIntervalExecution';
import { Tile } from '../utils/interfaces';
import Panel from './Panel';

const OutputPanelStyled = styled(Panel)`
  background-color: lightgreen;
`;

const Button = styled.button`
  margin-top: 10px;
`;

interface OutputPanelProps {
  tiles: Tile[];
}

export function OutputPanel({ tiles }: OutputPanelProps) {
  const executeFunction = useCallback(() => {
    console.warn("### > OutputPanel > tiles:", tiles);
  }, [tiles]);

  const { isRunning, start, stop } = useIntervalExecution(executeFunction, 1000);

  return (
    <OutputPanelStyled>
      <h2>Output</h2>
      <Button onClick={isRunning ? stop : start}>
        {isRunning ? 'Stop' : 'Start'} Execution
      </Button>
    </OutputPanelStyled>
  )
}
