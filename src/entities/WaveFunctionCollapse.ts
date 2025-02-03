import Random from 'prando';
import { Cell } from './Cell';
import { Grid } from './Grid';

export const random = new Random(54);

enum WFCStepName {
  COLLAPSE_WITH_MIN_ENTROPY = 'COLLAPSE_WITH_MIN_ENTROPY',
}

export interface WFCStep {
  name: WFCStepName;
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
    console.warn("### > WaveFunctionCollapse > step!", step);
    if (!step) {
      throw new Error('No pending steps');
  }

    this._handleStep(step);

    this.executedSteps.push(step);
  }

  private _startIteration(): void {
    this.pendingSteps.push({
      name: WFCStepName.COLLAPSE_WITH_MIN_ENTROPY
    });
    this.executedSteps.length = 0;
  }

  private _handleStep(step: WFCStep): void {
    switch (step.name) {
      case WFCStepName.COLLAPSE_WITH_MIN_ENTROPY:
        this._collapseWithMinEntropy();
        break;
      
      default:
        throw new Error(`Unknown step name: ${step.name}`);
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
  }
}
