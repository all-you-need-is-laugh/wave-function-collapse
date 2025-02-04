import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cell } from '../entities/Cell';
import { Grid } from '../entities/Grid';
import { Pixel } from '../entities/Pixel';
import { Tile } from '../entities/Tile';
import { WFCStep } from '../entities/WFCStep';
import { useIntervalExecution } from '../hooks/useIntervalExecution';
import { useWFCGrid } from '../hooks/useWFCGrid';
import Panel from './Panel';
import { WFCStepBlock } from './WFCStepBlock';

const WIDTH = 20;
const HEIGHT = 25;
const CELL_SIZE = 20;

const OutputPanelStyled = styled(Panel)`
  background-color: lightgreen;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Loader = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #555;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  min-width: 120px;
`;

const Button = styled.button`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const ExecutionButton = styled(Button)`
  font-size: 14px;
`;

const Canvas = styled.canvas`
  background-color: #333;
  height: auto;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0; /* Prevent canvas from shrinking */
`;

interface OutputPanelProps {
  tiles: Tile[];
}

function drawBorder(context: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawGrid(context: CanvasRenderingContext2D, grid: Grid, maxOptions: number, executedStep: WFCStep | undefined, pendingStep: WFCStep | undefined) {
  grid.forEach((cell: Cell, x: number, y: number) => {
    const pixel = cell.collapsed ? cell.getPixel() : new Pixel(0, Math.round(cell.options.length / maxOptions * 200), 0);

    context.fillStyle = pixel.getColor();
    context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    drawBorder(context, x, y, 'black', 0.2);

    if (cell.options.length > 1) {
      // choose contrast color
      const luminance = (0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b) / 255;
      context.fillStyle = luminance > 0.5 ? 'black' : 'white';

      // set font size
      context.font = `${CELL_SIZE * 0.7}px monospace`;
      context.textAlign = 'center';

      // add number in that rect
      context.fillText(cell.options.length.toString(), x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE * 0.7);
    }
  });

  if (executedStep) {
    const { x, y } = executedStep;
    if (x !== undefined && y !== undefined) {
      drawBorder(context, x, y, 'yellow', 2);
    }
  }

  if (pendingStep) {
    const { x, y } = pendingStep;
    if (x !== undefined && y !== undefined) {
      drawBorder(context, x, y, 'orange', 2);
    }
  }
}

export function OutputPanel({ tiles }: OutputPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [executedSteps, setExecutedSteps] = useState<WFCStep[]>([]);
  const [pendingSteps, setPendingSteps] = useState<WFCStep[]>([]);

  const onStep = useCallback((grid: Grid, executedSteps: WFCStep[], pendingSteps: WFCStep[]) => {
    setExecutedSteps(executedSteps);
    setPendingSteps(pendingSteps);

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let context = contextRef.current;
    if (!context) {
      context = contextRef.current = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas context is not available');
      }
    }

    drawGrid(context, grid, tiles.length, executedSteps[executedSteps.length - 1], pendingSteps[0]);
  }, [tiles.length]);

  const { stepExecutor } = useWFCGrid({
    width: WIDTH,
    height: HEIGHT,
    tiles,
    onStep,
  });

  useEffect(stepExecutor, [stepExecutor]);

  const { isRunning, start, stop } = useIntervalExecution(stepExecutor, 1000);

  return (
    <OutputPanelStyled>
      <h2>Output</h2>
      {
        tiles.length === 0 ? (
          <Loader>Loading...</Loader>
        ) : (
          <RowContainer>
            <StepsContainer>
              <ExecutionButton onClick={isRunning ? stop : start}>
                {isRunning ? 'Stop Execution' : 'Start Execution'}
              </ExecutionButton>
              <Button onClick={stepExecutor} disabled={isRunning}>
                Step
              </Button>
              {executedSteps.map((step, index) => <WFCStepBlock key={index} step={step} done={true} />)}
              {pendingSteps.map((step, index) => <WFCStepBlock key={index} step={step} />)}
            </StepsContainer>
            <Canvas
              ref={canvasRef}
              width={WIDTH * CELL_SIZE}
              height={HEIGHT * CELL_SIZE}
            />
          </RowContainer>
        )
      }
    </OutputPanelStyled >
  );
}

