import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cell } from '../entities/Cell';
import { Grid } from '../entities/Grid';
import { Tile } from '../entities/Tile';
import { WFCStep } from '../entities/WFCStep';
import { useIntervalExecution } from '../hooks/useIntervalExecution';
import { useWFCGrid } from '../hooks/useWFCGrid';
import { WFCStepBlock } from './WFCStepBlock';

const WIDTH = 20;
const HEIGHT = 20;
const CELL_SIZE = 20;

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
  min-width: 160px;
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

const IntervalInput = styled.input`
  width: 60px;
  height: 30px;
  margin-bottom: 10px;
  text-align: center;
`;

function drawBorder(context: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawGrid(context: CanvasRenderingContext2D, grid: Grid, executedStep: WFCStep | undefined, pendingStep: WFCStep | undefined) {
  grid.forEach((cell: Cell, x: number, y: number) => {
    const pixel = cell.getPixel();

    context.fillStyle = pixel.getColor();
    context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    drawBorder(context, x, y, 'black', 0.2);

    if (!cell.collapsed) {
      // choose contrast color
      const luminance = (0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b) / 255;
      context.fillStyle = luminance > 0.5 ? 'black' : 'white';

      // set font size
      if (cell.options.length.toString().length > 2) {
        context.font = `${CELL_SIZE * 0.55}px monospace`;
      } else {
        context.font = `${CELL_SIZE * 0.7}px monospace`;
      }
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

interface WFCExecutionAreaProps {
  tiles: Tile[];
}

export function WFCExecutionArea({ tiles }: WFCExecutionAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [executedSteps, setExecutedSteps] = useState<WFCStep[]>([]);
  const [pendingSteps, setPendingSteps] = useState<WFCStep[]>([]);
  const [intervalMs, setIntervalMs] = useState(100);
  const [seed, setSeed] = useState(54);

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

    drawGrid(context, grid, executedSteps[executedSteps.length - 1], pendingSteps[0]);
  }, []);

  const { stepExecutor } = useWFCGrid({
    width: WIDTH,
    height: HEIGHT,
    tiles,
    onStep,
    seed,
  });

  useEffect(stepExecutor, [stepExecutor]);

  const { isRunning, start, stop } = useIntervalExecution(stepExecutor, intervalMs);

  useEffect(() => {
    // Cleanup interval when tiles change
    return () => {
      stop();
    }
  }, [stop, tiles, seed]);

  return (
    <RowContainer>
      <StepsContainer>
        <ExecutionButton onClick={isRunning ? stop : start}>
          {isRunning ? 'Stop auto-execution' : 'Start auto-execution'}
        </ExecutionButton>
        <Button onClick={stepExecutor} disabled={isRunning}>Execute a step</Button>
        Auto-execution interval <IntervalInput
          type="number"
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          min="0"
          step="100"
        />
        Seed <IntervalInput
          type="number"
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
          min="0"
        />
        <br />
        <WFCStepBlock label={`Steps done: ${executedSteps.length}`} done={true} />
        <WFCStepBlock label={`Steps to do: ${pendingSteps.length}`} />
        {/* {executedSteps.map((step, index) => <WFCStepBlock key={index} label={step.name} done={true} />)} */}
        {/* {pendingSteps.map((step, index) => <WFCStepBlock key={index} label={step.name} />)} */}
      </StepsContainer>
      <Canvas
        ref={canvasRef}
        width={WIDTH * CELL_SIZE}
        height={HEIGHT * CELL_SIZE}
      />
    </RowContainer>
  );
}
