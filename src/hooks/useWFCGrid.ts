import { useCallback, useRef } from "react";
import { Cell } from '../entities/Cell';
import { Grid } from '../entities/Grid';
import { Tile } from "../entities/Tile";
import { WaveFunctionCollapse, WFCStep } from "../entities/WaveFunctionCollapse";

interface WFCGridHookResult {
  stepExecutor: () => void;
}

interface WFCGridHookParams {
  width: number;
  height: number;
  tiles: Tile[],
  onStep: (grid: Grid, executedSteps: WFCStep[], pendingSteps: WFCStep[]) => void
}

export const useWFCGrid = ({
  width,
  height,
  tiles,
  onStep,
}: WFCGridHookParams): WFCGridHookResult => {
  const gridRef = useRef<Grid | null>(null);
  const wfcRef = useRef<WaveFunctionCollapse | null>(null);

  const stepExecutor = useCallback(() => {
    if (!tiles.length) {
      return;
    }

    let grid = gridRef.current;
    if (!grid) {
      gridRef.current = grid = new Grid(width, height);

      grid.fill((_x, _y) => new Cell(tiles));

      // const cell = grid.get(random.nextInt(0, width), random.nextInt(0, height));
      
      // cell.forceCollapse(grid);
    }

    let wfc = wfcRef.current;
    if (!wfc) {
      wfcRef.current = wfc = new WaveFunctionCollapse(grid);
    } else {
      wfc.step();
    }

    onStep(grid, wfc.executedSteps, wfc.pendingSteps);
  }, [onStep, width, height, tiles]);

  return { stepExecutor };
};
