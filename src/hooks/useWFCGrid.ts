import { useCallback, useEffect, useRef } from "react";
import { Cell } from "../entities/Cell";
import { Grid } from "../entities/Grid";
import { Tile } from "../entities/Tile";
import { WaveFunctionCollapse } from "../entities/WaveFunctionCollapse";
import { WFCStep } from '../entities/WFCStep';

interface WFCGridHookResult {
  stepExecutor: () => void;
}

export interface WFCGridStepState {
  executedSteps: WFCStep[],
  pendingSteps: WFCStep[],
  stepDurations: { min: number; max: number; avg: number }
}

interface WFCGridHookParams {
  width: number;
  height: number;
  tiles: Tile[],
  onStep: (grid: Grid, state: WFCGridStepState) => void,
  seed: number
}

export const useWFCGrid = ({
  width,
  height,
  tiles,
  onStep,
  seed,
}: WFCGridHookParams): WFCGridHookResult => {
  const gridRef = useRef<Grid | null>(null);
  const wfcRef = useRef<WaveFunctionCollapse | null>(null);

  useEffect(() => {
    // Cleanup grid and wfc instances when tiles change
    return () => {
      gridRef.current = null;
      wfcRef.current = null;
    }
  }, [tiles, seed]);

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
      wfcRef.current = wfc = new WaveFunctionCollapse(grid, seed);
    } else {
      wfc.step();
    }
    
    onStep(grid, {
      executedSteps: [...wfc.executedSteps],
      pendingSteps: [...wfc.pendingSteps],
      stepDurations: wfc.stepDurations
    });
  }, [onStep, width, height, tiles, seed]);

  return { stepExecutor };
};
