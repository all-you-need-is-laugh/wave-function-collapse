import Random from 'prando';
import { useCallback, useRef } from "react";
import { Tile } from "../entities/Tile";
import { Pixel } from "../utils/Pixel";

const random = new Random(13);

export class Cell {
  readonly options: Tile[];

  collapsed = false;

  constructor(
    public readonly i: number,
    public readonly j: number,
    tiles: Tile[]) {
    this.options = [...tiles];

    // this.options = this.options.slice(0, random.nextInt(1, this.options.length));
  }

  forceCollapse(grid: Grid): void {
    if (this.collapsed) {
      throw new Error('Cell is already collapsed');
    }

    if (this.options.length === 0) {
      throw new Error('Cell has no options');
    }

    const tile = random.nextArrayItem(this.options);
    this.options.length = 0;
    this.options.push(tile);

    this.collapsed = true;

  //   console.groupCollapsed("### > collapseStepGrid > cell:", this);

  //   // this._tryCollapseNeighbors(grid);

  //   console.groupEnd();
  }

  getCollapsedTile(): Tile {
    if (this.collapsed) {
      return this.options[0];
    }

    throw new Error('Cell is not collapsed');
  }

  getPixel(): Pixel {
    if (this.collapsed) {
      const tile = this.options[0];
      return tile.data[Math.floor(tile.data.length / 2)];
    }

    const resultingPixel: Pixel = new Pixel(0, 0, 0);

    const len = this.options.length;
    for (let i = 0; i < len; i++) {
      const tile = this.options[i];
      const pixel = tile.data[Math.floor(tile.data.length / 2)];

      resultingPixel.r += pixel.r / len;
      resultingPixel.g += pixel.g / len;
      resultingPixel.b += pixel.b / len;
    }

    return resultingPixel;
  }

  // _checkNeighbors(grid: Grid) {
  //   if (this.collapsed) {
  //     return;
  //   }

  //   const startOptionsLength = this.options.length;
  //   let availableOptions = [...this.options];
  //   console.warn("### > checkNeighbors > cell.options:", this.options);

  //   // check top neighbor
  //   if (this.j > 0) {
  //     availableOptions = grid[(this.j - 1) * WIDTH + this.i]._filterByNeighbors(availableOptions, tile => tile.bottomNeighbors);
  //     console.warn("### > checkNeighbors > availableOptions [top]", availableOptions);
  //   }

  //   // check right neighbor
  //   if (this.i < WIDTH - 1) {
  //     availableOptions = grid[this.j * WIDTH + this.i + 1]._filterByNeighbors(availableOptions, tile => tile.leftNeighbors);
  //     console.warn("### > checkNeighbors > availableOptions [right]", availableOptions);
  //   }

  //   // check bottom neighbor
  //   if (this.j < HEIGHT - 1) {
  //     availableOptions = grid[(this.j + 1) * WIDTH + this.i]._filterByNeighbors(availableOptions, tile => tile.topNeighbors);
  //     console.warn("### > checkNeighbors > availableOptions [bottom]", availableOptions);
  //   }

  //   // check left neighbor
  //   if (this.i > 0) {
  //     availableOptions = grid[this.j * WIDTH + this.i - 1]._filterByNeighbors(availableOptions, tile => tile.rightNeighbors);
  //     console.warn("### > checkNeighbors > availableOptions [left]", availableOptions);
  //   }

  //   this.options.length = 0;
  //   console.warn("### > checkNeighbors > availableOptions:", availableOptions, startOptionsLength);
  //   this.options.push(...availableOptions);

  //   if (this.options.length < 2) {
  //     this.forceCollapse(grid);
  //   }

  //   // if (startOptionsLength !== this.options.length) {
  //   //   this._tryCollapseNeighbors(grid);
  //   // }
  // }

  // private _filterByNeighbors(originalOptions: Tile[], neighborsFieldGetter: (tile: Tile) => Tile[]): Tile[] {
  //   const availableOptionSet = this.options.reduce((accumulator, option) => {
  //     for (const tile of neighborsFieldGetter(option)) {
  //       if (originalOptions.includes(tile)) {
  //         accumulator.add(tile);
  //       }
  //     }

  //     return accumulator;
  //   }, new Set<Tile>());

  //   return [...availableOptionSet];
  // }

  // private _tryCollapseNeighbors(grid: Grid) {
  //   // check top neighbor
  //   if (this.j > 0) {
  //     grid[(this.j - 1) * WIDTH + this.i]._checkNeighbors(grid);
  //   }

  //   // check right neighbor
  //   if (this.i < WIDTH - 1) {
  //     grid[this.j * WIDTH + this.i + 1]._checkNeighbors(grid);
  //   }

  //   // check bottom neighbor
  //   if (this.j < HEIGHT - 1) {
  //     grid[(this.j + 1) * WIDTH + this.i]._checkNeighbors(grid);
  //   }

  //   // check left neighbor
  //   if (this.i > 0) {
  //     grid[this.j * WIDTH + this.i - 1]._checkNeighbors(grid);
  //   }
  // }
}

export class Grid {
  private readonly _cells: Cell[] = [];

  constructor(
    public readonly width: number,
    public readonly height: number
  ) { }

  private _index(x: number, y: number): number {
    return y * this.width + x;
  }

  get(x: number, y: number): Cell {
    return this._cells[this._index(x, y)];
  }

  set(x: number, y: number, cell: Cell): void {
    this._cells[this._index(x, y)] = cell;
  }

  fill(callback: (x: number, y: number) => Cell): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.set(x, y, callback(x, y));
      }
    }
  }

  forEach(callback: (cell: Cell, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.get(x, y), x, y);
      }
    }
  }
}

// function collapseStepGrid(grid: Grid): void {
//   console.warn("### > collapseStepGrid > grid:", grid);

//   const entropyGroups = new Map<number, Cell[]>();

//   for (let j = 0; j < HEIGHT; j++) {
//     for (let i = 0; i < WIDTH; i++) {
//       const index = j * WIDTH + i;
//       const cell = grid[index];

//       if (cell.collapsed) {
//         continue;
//       }

//       const entropy = cell.options.length;
//       let group = entropyGroups.get(entropy);
//       if (!group) {
//         group = [];
//         entropyGroups.set(entropy, group);
//       }

//       group.push(cell);
//     }
//   }

//   const minEntropy = Math.min(...entropyGroups.keys());
//   const minEntropyGroup = entropyGroups.get(minEntropy);
//   if (minEntropyGroup) {
//     const cell = random.nextArrayItem(minEntropyGroup);
//     cell.forceCollapse(grid);
//   }
// }

// interface WFCAction {

// }

interface WFCGridHookResult {
  actionExecutor: () => void;
}

interface WFCGridHookParams {
  width: number;
  height: number;
  tiles: Tile[],
  onStep: (grid: Grid) => void
}

export const useWFCGrid = ({
  width,
  height,
  tiles,
  onStep,
}: WFCGridHookParams): WFCGridHookResult => {
  const gridRef = useRef<Grid | null>(null);
  // const actionsRef = useRef<WFCAction[]>([]);

  const actionExecutor = useCallback(() => {
    let grid = gridRef.current;
    if (!grid) {
      gridRef.current = grid = new Grid(width, height);

      grid.fill((i, j) => new Cell(i, j, tiles));

      // const cell = grid.get(random.nextInt(0, width), random.nextInt(0, height));
      
      // cell.forceCollapse(grid);
    }

    onStep(grid);
  }, [onStep, width, height, tiles]);

  return { actionExecutor };
};
