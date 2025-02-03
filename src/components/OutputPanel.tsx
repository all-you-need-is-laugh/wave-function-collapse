import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import { useIntervalExecution } from '../hooks/useIntervalExecution';
import { Grid, useWFCGrid } from '../hooks/useWFCGrid';
import { Pixel } from '../utils/Pixel';
import Panel from './Panel';

const WIDTH = 20;
const HEIGHT = 25;
const CELL_SIZE = 20;

const OutputPanelStyled = styled(Panel)`
  background-color: lightgreen;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BaseButton = styled.button`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled(BaseButton)`
  margin-bottom: 20px;
`;

const StepButton = styled(BaseButton)``;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Canvas = styled.canvas`
  background-color: #333;
  height: auto;
  object-fit: contain;
  image-rendering: pixelated;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const drawGrid = useCallback((grid: Grid) => {
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

    grid.forEach((cell, x, y) => {
      const pixel = cell.collapsed ? cell.getPixel() : new Pixel(0, Math.round(cell.options.length / tiles.length * 200), 0);

      context.fillStyle = pixel.getColor();
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // add border
      context.strokeStyle = 'black';
      context.lineWidth = 0.2;
      context.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // choose contrast color
      const luminance = (0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b) / 255;
      context.fillStyle = luminance > 0.5 ? 'black' : 'white';

      // set font size
      context.font = `${CELL_SIZE * 0.7}px monospace`;
      context.textAlign = 'center';

      // add number in that rect
      context.fillText(cell.options.length.toString(), x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE * 0.7);
    })
  }, [tiles.length]);

  const { stepExecutor } = useWFCGrid({
    width: WIDTH,
    height: HEIGHT,
    tiles,
    onStep: drawGrid,
  });

  const { isRunning, start, stop } = useIntervalExecution(stepExecutor, 1000);

  return (
    <OutputPanelStyled>
      <h2>Output</h2>
      {tiles.length === 0 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <ButtonContainer>
            <Button onClick={isRunning ? stop : start}>
              {isRunning ? 'Stop Execution' : 'Start Execution'}
            </Button>
            <StepButton onClick={stepExecutor} disabled={isRunning}>
              Step
            </StepButton>
          </ButtonContainer>
          <Canvas
            ref={canvasRef}
            width={WIDTH * CELL_SIZE}
            height={HEIGHT * CELL_SIZE}
          />
        </>
      )}
    </OutputPanelStyled>
  );
}

