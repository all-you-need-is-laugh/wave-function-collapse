import styled from 'styled-components';

interface WFCStepBlockProps {
  label: string;
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

export function WFCStepBlock({ label, done = false }: WFCStepBlockProps) {
  return (
    <Badge $done={done}>
      {label}
    </Badge>
  );
}
