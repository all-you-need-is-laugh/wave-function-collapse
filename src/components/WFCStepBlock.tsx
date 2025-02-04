import styled from 'styled-components';
import { WFCStep } from "../entities/WaveFunctionCollapse";

interface WFCStepBlockProps {
  step: WFCStep;
  done?: boolean;
}

const Badge = styled.div<{ $done: boolean }>`
  padding: 10px;
  border-radius: 12px;
  background-color: ${props => (props.$done ? 'green' : 'skyblue')};
  color: black;
`;

export function WFCStepBlock({ step, done = false }: WFCStepBlockProps) {
  return (
    <Badge $done={done}>
      {step.name}
    </Badge>
  );
}
