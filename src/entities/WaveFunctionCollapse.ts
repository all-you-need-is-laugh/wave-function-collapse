import Random from 'prando';
import { Cell } from './Cell';
import { Grid } from './Grid';

export const random = new Random(54);

enum WFCStepType {
  CALCULATE_ENTROPY = 'CALCULATE_ENTROPY',
  COLLAPSE_WITH_MIN_ENTROPY = 'COLLAPSE_WITH_MIN_ENTROPY',
}

export class WFCStep {
  private constructor(
    readonly type: WFCStepType,
    readonly name: string,
    readonly x?: number,
    readonly y?: number
  ) {}

  static CollapseWithMinEntropy(): WFCStep {
    return new WFCStep(WFCStepType.COLLAPSE_WITH_MIN_ENTROPY, 'Collapse min');
  }

  static CalculateEntropy(x: number, y: number): WFCStep {
    return new WFCStep(WFCStepType.CALCULATE_ENTROPY, `Calculate entropy [${x}, ${y}]`, x, y);
  }
}

export class WaveFunctionCollapse {
  readonly executedSteps: WFCStep[] = [];
  readonly pendingSteps: WFCStep[] = [];

  constructor (
    private readonly _grid: Grid
  ) {
    this._startIteration();
  }

  step(): void {
    if (this.pendingSteps.length === 0) {
      this._startIteration();
    }
    
    const step = this.pendingSteps.shift();
    console.log("### > WaveFunctionCollapse > step!", step);
    if (!step) {
      throw new Error('No pending steps');
  }

    this._handleStep(step);

    this.executedSteps.push(step);
  }

  private _startIteration(): void {
    this.pendingSteps.push(WFCStep.CollapseWithMinEntropy());
    this.executedSteps.length = 0;
  }

  private _handleStep(step: WFCStep): void {
    switch (step.type) {
      case WFCStepType.COLLAPSE_WITH_MIN_ENTROPY:
        this._collapseWithMinEntropy();
        return;

      case WFCStepType.CALCULATE_ENTROPY:
        this._calculateEntropy(step.x, step.y);
        return;
      
      default:
        throw new Error(`Unknown step name: ${step.type}`);
    }
  }

  private _collapseWithMinEntropy(): void {
    const entropyGroups = new Map<number, Cell[]>();

    let collapsedCount = 0;
    this._grid.forEach((cell: Cell) => {
      if (cell.collapsed) {
        collapsedCount++;
        return;
      }

      const entropy = cell.options.length;
      let group = entropyGroups.get(entropy);
      if (!group) {
        group = [];
        entropyGroups.set(entropy, group);
      }

      group.push(cell);
    });

    if (collapsedCount === this._grid.width * this._grid.height) {
      console.log('All cells are collapsed!');
      return;
    }

    const minEntropy = Math.min(...entropyGroups.keys());
    const minEntropyGroup = entropyGroups.get(minEntropy);
    if (!minEntropyGroup) {
      throw new Error('Min entropy group not found');
    }

    const cell = random.nextArrayItem(minEntropyGroup);
    const tileIndexToCollapse = random.nextInt(0, cell.options.length - 1);
    cell.collapse(tileIndexToCollapse);

    const {x, y} = this._grid.getCoordinates(cell);

    // top neighbor
    if (x > 0) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x - 1, y));
    }

    // right neighbor
    if (y < this._grid.height - 1) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x, y + 1));
    }

    // bottom neighbor
    if (x < this._grid.width - 1) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x + 1, y));
    }

    // left neighbor
    if (y > 0) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x, y - 1));
    }
  }
  private _calculateEntropy(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      throw new Error('Coordinates are not provided');
    }
  }
}
