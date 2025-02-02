import { Pixel } from "../utils/interfaces";

export class Tile {
  constructor(
    public size: number,
    public data: Pixel[]
  ) {}
}
