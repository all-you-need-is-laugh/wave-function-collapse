import styled from 'styled-components';
import Panel from './Panel';

const InputPanelStyled = styled(Panel)`
  background-color: lightblue;
`;

export function InputPanel() {
  return (
    <InputPanelStyled>
      <h2>Input</h2>
      <img src="samples/City.png" />
    </InputPanelStyled>
  )
}
