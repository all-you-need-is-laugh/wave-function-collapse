import styled from 'styled-components';
import { WFCStep } from '../entities/WFCStep';

interface WFCStepBlockProps {
  step: WFCStep;
  done?: boolean;
}

const Badge = styled.div<{ $done: boolean }>`
  width: 160px;
  padding: 5px 10px;
  border-radius: 12px;
  border: 1px solid ${props => (props.$done ? 'darkgreen' : 'darkblue')};
  background-color: ${props => (props.$done ? 'green' : 'skyblue')};
  color: ${props => (props.$done ? 'white' : 'black')};
  font-size: 14px;
  text-align: center;
`;

export function WFCStepBlock({ step, done = false }: WFCStepBlockProps) {
  return (
    <Badge $done={done}>
      {step.name}
    </Badge>
  );
}
