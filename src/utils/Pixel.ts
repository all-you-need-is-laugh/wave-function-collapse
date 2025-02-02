export class Pixel {
  constructor(
    public r: number,
    public g: number,
    public b: number
  ) {}

  getColor(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}
