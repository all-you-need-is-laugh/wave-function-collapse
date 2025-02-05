import Random from 'prando';
import { Cell } from './Cell';
import { Grid } from './Grid';
import { Tile } from './Tile';
import { WFCStep, WFCStepType } from './WFCStep';

export const random = new Random(54);

export class WaveFunctionCollapse {
  readonly executedSteps: WFCStep[] = [];
  readonly pendingSteps: WFCStep[] = [];

  constructor(
    private readonly _grid: Grid
  ) {
    this._startIteration();
  }

  step(): void {
    if (this.pendingSteps.length === 0) {
      this._startIteration();
    }

    const step = this.pendingSteps.shift();
    // console.log("### > WaveFunctionCollapse > step!", step);
    if (!step) {
      throw new Error('No pending steps');
    }

    this._handleStep(step);

    this.executedSteps.push(step);
  }

  private _startIteration(): void {
    this.pendingSteps.push(WFCStep.PickWithMinEntropy());
    // this.executedSteps.length = 0;
  }

  private _handleStep(step: WFCStep): void {
    switch (step.type) {
      case WFCStepType.PICK_WITH_MIN_ENTROPY:
        this._pickWithMinEntropy();
        return;

      case WFCStepType.COLLAPSE:
        this._collapse(step.x, step.y);
        return;

      case WFCStepType.CALCULATE_ENTROPY:
        this._calculateEntropy(step.x, step.y);
        return;

      default:
        throw new Error(`Unknown step name: ${step.type}`);
    }
  }

  private _pickWithMinEntropy(): void {
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
      throw new Error('All cells are collapsed!');
    }

    const minEntropy = Math.min(...entropyGroups.keys());
    const minEntropyGroup = entropyGroups.get(minEntropy);
    if (!minEntropyGroup) {
      throw new Error('Min entropy group not found');
    }

    const cell = random.nextArrayItem(minEntropyGroup);
    const { x, y } = this._grid.getCoordinates(cell);

    this.pendingSteps.push(WFCStep.Collapse(x, y));
  }

  private _collapse(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      throw new Error('Coordinates are not provided');
    }

    const cell = this._grid.get(x, y);
    const tileIndexToCollapse = random.nextInt(0, cell.options.length - 1);
    // consoleTile(cell.options[tileIndexToCollapse], `collapsed [${x}, ${y}] with tile`);
    cell.collapse(tileIndexToCollapse);

    this._propagateEntropyCalculation(x, y);
  }

  private _propagateEntropyCalculation(x: number, y: number) {
    // top neighbor
    if (y > 0) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x, y - 1));
    }

    // right neighbor
    if (x < this._grid.width - 1) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x + 1, y));
    }

    // bottom neighbor
    if (y < this._grid.height - 1) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x, y + 1));
    }

    // left neighbor
    if (x > 0) {
      this.pendingSteps.push(WFCStep.CalculateEntropy(x - 1, y));
    }
  }

  private _calculateEntropy(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      throw new Error('Coordinates are not provided');
    }

    const cell = this._grid.get(x, y);

    if (cell.collapsed) {
      return;
    }

    const startOptionsLength = cell.options.length;
    let availableOptions = [...cell.options];
    // console.log("### > _calculateEntropy > cell.options:", cell.options);

    // check top neighbor
    if (y > 0) {
      availableOptions = this._filterByNeighbor(this._grid.get(x, y - 1), availableOptions, tile => tile.bottomNeighbors);
      // console.log("### > _calculateEntropy > availableOptions [top]", availableOptions);
    }

    // check right neighbor
    if (x < this._grid.width - 1) {
      availableOptions = this._filterByNeighbor(this._grid.get(x + 1, y), availableOptions, tile => tile.leftNeighbors);
      // console.log("### > _calculateEntropy > availableOptions [right]", availableOptions);
    }

    // check bottom neighbor
    if (y < this._grid.height - 1) {
      availableOptions = this._filterByNeighbor(this._grid.get(x, y + 1), availableOptions, tile => tile.topNeighbors);
      // console.log("### > _calculateEntropy > availableOptions [bottom]", availableOptions);
    }

    // check left neighbor
    if (x > 0) {
      availableOptions = this._filterByNeighbor(this._grid.get(x - 1, y), availableOptions, tile => tile.rightNeighbors);
      // console.log("### > _calculateEntropy > availableOptions [left]", availableOptions);
    }

    cell.options.splice(0, cell.options.length, ...availableOptions);

    if (cell.options.length < 2) {
      this.pendingSteps.unshift(WFCStep.Collapse(x, y));
    }

    if (startOptionsLength !== cell.options.length) {
      this._propagateEntropyCalculation(x, y);
    }
  }

  private _filterByNeighbor(neighborCell: Cell, originalOptions: Tile[], neighborsFieldGetter: (tile: Tile) => Tile[]): Tile[] {
    // console.group(neighborsFieldGetter, neighborCell.options.length);

    const availableOptionSet = neighborCell.options.reduce((accumulator, option) => {
      // consoleTile(option, 'option');

      for (const tile of neighborsFieldGetter(option)) {
        // consoleTile(tile, `neigbor's tile; available: ${originalOptions.includes(tile)}`);

        if (originalOptions.includes(tile)) {
          accumulator.add(tile);
        }
      }
      return accumulator;
    }, new Set<Tile>());

    // console.groupEnd();

    return [...availableOptionSet];
  }
}
