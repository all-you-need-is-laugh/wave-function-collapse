import { Grid } from './Grid';

export class WaveFunctionCollapse {
  constructor (
    private readonly _grid: Grid
  ) {}

  step(): void {
    console.warn("### > WaveFunctionCollapse > step!");
  }
}
