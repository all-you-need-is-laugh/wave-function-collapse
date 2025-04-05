import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cell } from '../entities/Cell';
import { Grid } from '../entities/Grid';
import { Tile } from '../entities/Tile';
import { WFCStep } from '../entities/WFCStep';
import { useIntervalExecution } from '../hooks/useIntervalExecution';
import { useWFCGrid, WFCGridStepState } from '../hooks/useWFCGrid';
import { WFCStepBlock } from './WFCStepBlock';

const DEFAULT_CELL_SIZE = 20;

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
  min-width: 220px;
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

const NumberInput = styled.input`
  width: 60px;
  height: 30px;
  text-align: center;
`;

const LabelContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: space-between;
`;

function drawBorder(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  lineWidth: number,
  cellSize: number,
  draw: boolean
) {
  if (!draw) return;
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawGrid(
  context: CanvasRenderingContext2D,
  grid: Grid,
  executedStep: WFCStep | undefined,
  pendingStep: WFCStep | undefined,
  cellSize: number,
  drawBorderEnabled: boolean,
  showText: boolean
) {
  grid.forEach((cell: Cell, x: number, y: number) => {
    const pixel = cell.getPixel();

    context.fillStyle = pixel.getColor();
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

    drawBorder(context, x, y, 'black', 0.2, cellSize, drawBorderEnabled);

    if (showText && !cell.collapsed) {
      // choose contrast color
      const luminance = (0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b) / 255;
      context.fillStyle = luminance > 0.5 ? 'black' : 'white';

      // set font size
      if (cell.options.length.toString().length > 2) {
        context.font = `${cellSize * 0.55}px monospace`;
      } else {
        context.font = `${cellSize * 0.7}px monospace`;
      }
      context.textAlign = 'center';

      // add number in that rect
      context.fillText(cell.options.length.toString(), x * cellSize + cellSize / 2, y * cellSize + cellSize * 0.7);
    }
  });

  if (executedStep) {
    const { x, y } = executedStep;
    if (x !== undefined && y !== undefined) {
      drawBorder(context, x, y, 'yellow', 2, cellSize, true);
    }
  }

  if (pendingStep) {
    const { x, y } = pendingStep;
    if (x !== undefined && y !== undefined) {
      drawBorder(context, x, y, 'orange', 2, cellSize, true);
    }
  }
}

interface WFCExecutionAreaProps {
  tiles: Tile[];
}

export function WFCExecutionArea({ tiles }: WFCExecutionAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const cellSizeRef = useRef<HTMLInputElement>(null);
  const [executedSteps, setExecutedSteps] = useState<WFCStep[]>([]);
  const [pendingSteps, setPendingSteps] = useState<WFCStep[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [intervalMs, setIntervalMs] = useState(0);
  const [seed, setSeed] = useState(54);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [drawBorderEnabled, setDrawBorderEnabled] = useState(true);
  const [showText, setShowText] = useState(true);

  const onStep = useCallback(
    (grid: Grid, { executedSteps, pendingSteps, duration }: WFCGridStepState) => {
      setExecutedSteps(executedSteps);
      setPendingSteps(pendingSteps);
      setDuration(duration / 1000);

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

      const cellSize = cellSizeRef.current ? Number(cellSizeRef.current.value) : DEFAULT_CELL_SIZE;
      drawGrid(context, grid, executedSteps[executedSteps.length - 1], pendingSteps[0], cellSize, drawBorderEnabled, showText);
    },
    [drawBorderEnabled, showText]
  );

  const { stepExecutor } = useWFCGrid({
    width,
    height,
    tiles,
    onStep,
    seed,
  });

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
        <LabelContainer>
          Auto-exec. interval
          <NumberInput
            type="number"
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            min="0"
            step="100"
          />
        </LabelContainer>
        <LabelContainer>
          Seed
          <NumberInput
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
            min="0"
          />
        </LabelContainer>
        <LabelContainer>
          Width
          <NumberInput
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min="1"
          />
        </LabelContainer>
        <LabelContainer>
          Height
          <NumberInput
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min="1"
          />
        </LabelContainer>
        <LabelContainer>
          Cell Size
          <NumberInput
            ref={cellSizeRef}
            type="number"
            defaultValue={DEFAULT_CELL_SIZE}
            min="1"
          />
        </LabelContainer>
        <label>
          <input
            type="checkbox"
            checked={drawBorderEnabled}
            onChange={(e) => setDrawBorderEnabled(e.target.checked)}
          />
          Draw Borders
        </label>
        <label>
          <input
            type="checkbox"
            checked={showText}
            onChange={(e) => setShowText(e.target.checked)}
          />
          Show Text
        </label>
        <WFCStepBlock label={`Steps done: ${executedSteps.length}`} done={true} />
        <WFCStepBlock label={`Steps to do: ${pendingSteps.length}`} />
        <WFCStepBlock label={`Duration: ${duration.toFixed(3)}`} />
        {/* {executedSteps.map((step, index) => <WFCStepBlock key={index} label={step.name} done={true} />)} */}
        {/* {pendingSteps.map((step, index) => <WFCStepBlock key={index} label={step.name} />)} */}
      </StepsContainer>
      <Canvas
        ref={canvasRef}
        width={width * (cellSizeRef.current ? Number(cellSizeRef.current.value) : DEFAULT_CELL_SIZE)}
        height={height * (cellSizeRef.current ? Number(cellSizeRef.current.value) : DEFAULT_CELL_SIZE)}
      />
    </RowContainer>
  );
}
