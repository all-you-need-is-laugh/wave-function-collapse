import styled from 'styled-components';
import Panel from './Panel';

const OutputPanelStyled = styled(Panel)`
  background-color: lightgreen;
`;

export function OutputPanel() {
  return (
    <OutputPanelStyled>
      <h2>Output</h2>
    </OutputPanelStyled>
  )
}
