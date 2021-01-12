/// <reference no-default-lib="true" />
/// <reference lib="dom" />

export interface Font {
  height: number;
  measureText: (text: string) => TextMetrics;
}

export class CanvasFont {
  private font?: string;
  private chachedHeight?: number;

  constructor(private ctx: CanvasRenderingContext2D) {}

  get height(): number {
    if (this.font !== this.ctx.font) {
      this.font = this.ctx.font;
      this.chachedHeight = this.ctx.measureText("W").actualBoundingBoxAscent;
    }
    return <number> this.chachedHeight;
  }

  measureText(text: string): TextMetrics {
    return this.ctx.measureText(text);
  }
}
