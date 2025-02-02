export class Pixel {
  constructor(
    public r: number,
    public g: number,
    public b: number
  ) {}

  equals(pixel: Pixel): boolean {
    return this.r === pixel.r && this.g === pixel.g && this.b === pixel.b;
  }

  getColor(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}
