import Random from 'prando';
import { Cell } from './Cell';
import { Grid } from './Grid';
import { Tile } from './Tile';
import { WFCStep, WFCStepType } from './WFCStep';

export class WaveFunctionCollapse {
  readonly executedSteps: WFCStep[] = [];
  readonly pendingSteps: WFCStep[] = [];
  private readonly _random: Random;

  constructor(
    private readonly _grid: Grid,
    seed: number,
  ) {
    this._random = new Random(seed);
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
        return undefined;
      }

      const entropy = cell.optionsCount;
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

    const cell = this._random.nextArrayItem(minEntropyGroup);
    const { x, y } = this._grid.getCoordinates(cell);

    this.pendingSteps.push(WFCStep.Collapse(x, y));
  }

  private _collapse(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      throw new Error('Coordinates are not provided');
    }

    const cell = this._grid.get(x, y);
    const tileIndexToCollapse = this._random.nextInt(0, cell.optionsCount - 1);
    cell.collapse(tileIndexToCollapse);

    this._propagateEntropyCalculation(x, y);
  }

  private _propagateEntropyCalculation(x: number, y: number) {
    // top neighbor
    if (y > 0) {
      this._appendCalculateEntropyStep(x, y - 1);
    }

    // right neighbor
    if (x < this._grid.width - 1) {
      this._appendCalculateEntropyStep(x + 1, y);
    }

    // bottom neighbor
    if (y < this._grid.height - 1) {
      this._appendCalculateEntropyStep(x, y + 1);
    }

    // left neighbor
    if (x > 0) {
      this._appendCalculateEntropyStep(x - 1, y);
    }
  }

  private _appendCalculateEntropyStep(x: number, y: number): void {
    if (this._grid.get(x, y).collapsed) {
      return;
    }
    if (
      this.pendingSteps.some(
        step => step.x === x && step.y === y && step.type === WFCStepType.CALCULATE_ENTROPY,
      )
    ) {
      return;
    }
    this.pendingSteps.push(WFCStep.CalculateEntropy(x, y));
  }

  private _calculateEntropy(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      throw new Error('Coordinates are not provided');
    }

    const cell = this._grid.get(x, y);

    if (cell.collapsed) {
      return;
    }

    const startOptionsLength = cell.optionsCount;
    let availableOptions = cell.getAllOptions();

    // check top neighbor
    if (y > 0) {
      availableOptions = this._filterByNeighbor(
        this._grid.get(x, y - 1),
        availableOptions,
        tile => tile.bottomNeighbors,
      );
    }

    // check right neighbor
    if (x < this._grid.width - 1) {
      availableOptions = this._filterByNeighbor(
        this._grid.get(x + 1, y),
        availableOptions,
        tile => tile.leftNeighbors,
      );
    }

    // check bottom neighbor
    if (y < this._grid.height - 1) {
      availableOptions = this._filterByNeighbor(
        this._grid.get(x, y + 1),
        availableOptions,
        tile => tile.topNeighbors,
      );
    }

    // check left neighbor
    if (x > 0) {
      availableOptions = this._filterByNeighbor(
        this._grid.get(x - 1, y),
        availableOptions,
        tile => tile.rightNeighbors,
      );
    }

    cell.resetOptions(availableOptions);

    if (cell.optionsCount < 2) {
      this.pendingSteps.unshift(WFCStep.Collapse(x, y));
    }

    if (startOptionsLength !== cell.optionsCount) {
      this._propagateEntropyCalculation(x, y);
    }
  }

  private _filterByNeighbor(
    neighborCell: Cell,
    originalOptions: Tile[],
    neighborsFieldGetter: (tile: Tile) => Tile[],
  ): Tile[] {
    const availableOptionSet = new Set<Tile>();

    for (let i = 0; i < neighborCell.optionsCount; i++) {
      const option = neighborCell.getOption(i);

      for (const tile of neighborsFieldGetter(option)) {
        if (originalOptions.includes(tile)) {
          availableOptionSet.add(tile);
        }
      }
    }

    return [...availableOptionSet];
  }
}
