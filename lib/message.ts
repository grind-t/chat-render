/// <reference no-default-lib="true" />
/// <reference lib="dom" />

import Rectangle from "./rectangle.ts";

export interface MessageItem extends Rectangle {
  readonly content: any;
  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void;
}

class TextItem extends Rectangle {
  constructor(readonly content: string, width: number, height: number) {
    super(0, 0, width, height);
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    const x = this.x + offsetX;
    const y = this.y + offsetY + this.height;
    ctx.fillText(this.content, x, y);
  }
}

class ImageItem extends Rectangle {
  constructor(readonly content: HTMLImageElement) {
    super(0, 0, content.width, content.height);
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.drawImage(this.content, x, y, this.width, this.height);
  }
}

export class Emotes {
  readonly regexp: RegExp;

  constructor(readonly map: ReadonlyMap<string, HTMLImageElement>) {
    let pattern = [];
    for (const name of map.keys()) {
      pattern.push(name.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"));
    }
    this.regexp = new RegExp(pattern.join("|"), "g");
  }
}

export class MessageLayout {
  readonly itemsSpacing: number;
  readonly fontHeight: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    public width: number,
    public linesSpacing: number,
    public itemsVerticalAlign: "bottom" | "center" | "top" = "center",
  ) {
    this.itemsSpacing = ctx.measureText(" ").width;
    this.fontHeight = ctx.measureText("W").actualBoundingBoxAscent;
  }
}

export class MessageStyle {
  constructor(
    public authorFillStyle: string,
    public messageFillStyle: string,
  ) {}
}

export class Message extends Rectangle {
  constructor(
    readonly content: ReadonlyArray<MessageItem>,
    width: number,
    height: number,
  ) {
    super(0, 0, width, height);
  }

  static fromString(
    str: string,
    layout: MessageLayout,
    ctx: CanvasRenderingContext2D,
  ): Message {
    return setLayout(
      parseString(str, layout.width, layout.fontHeight, ctx),
      layout,
    );
  }

  static fromStringWithEmotes(
    str: string,
    emotes: Emotes,
    layout: MessageLayout,
    ctx: CanvasRenderingContext2D,
  ): Message {
    return setLayout(
      parseStringWithEmotes(str, emotes, layout.width, layout.fontHeight, ctx),
      layout,
    );
  }

  static fromStringWithEmotesAndBadges() {
    throw new Error("Not implemented.");
  }

  draw(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    style: MessageStyle,
  ) {
    if (!this.content) return;
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.fillStyle = style.authorFillStyle;
    const author = this.content[0];
    author.draw(ctx, x, y);
    ctx.fillStyle = style.messageFillStyle;
    for (let i = 1; i < this.content.length; i++) {
      this.content[i].draw(ctx, x, y);
    }
  }
}

function splitLongText(
  text: TextItem,
  lineWidth: number,
  ctx: CanvasRenderingContext2D,
): TextItem[] {
  const chunks: TextItem[] = [];
  const textFrom = (str: string) =>
    new TextItem(str, ctx.measureText(str).width, text.height);
  const strIter = text.content[Symbol.iterator]();
  let current = textFrom(strIter.next().value);
  for (const c of strIter) {
    let next = textFrom(current.content + c);
    if (next.width > lineWidth) {
      chunks.push(current);
      next = textFrom(c);
    }
    current = next;
  }
  chunks.push(current);
  return chunks;
}

function parseString(
  str: string,
  lineWidth: number,
  fontHeight: number,
  ctx: CanvasRenderingContext2D,
): TextItem[] {
  const items: TextItem[] = [];
  const words = str.match(/\S+/g);
  if (!words) return items;
  for (const word of words) {
    const item = new TextItem(word, ctx.measureText(word).width, fontHeight);
    if (item.width <= lineWidth) items.push(item);
    else items.push(...splitLongText(item, lineWidth, ctx));
  }
  return items;
}

function parseStringWithEmotes(
  str: string,
  emotes: Emotes,
  lineWidth: number,
  fontHeight: number,
  ctx: CanvasRenderingContext2D,
): MessageItem[] {
  const items: MessageItem[] = [];
  const emotesMatches = str.matchAll(emotes.regexp);
  let strIdx = 0;
  for (const emoteMatch of emotesMatches) {
    const strChunk = str.slice(strIdx, emoteMatch.index);
    const textItems = parseString(strChunk, lineWidth, fontHeight, ctx);
    if (textItems) items.push(...textItems);
    const emoteName = emoteMatch[0];
    const emoteImage = <HTMLImageElement> emotes.map.get(emoteName);
    items.push(new ImageItem(emoteImage));
    strIdx += strChunk.length + emoteName.length;
  }
  const lastChunk = str.slice(strIdx, str.length);
  const textItems = parseString(lastChunk, lineWidth, fontHeight, ctx);
  if (textItems) items.push(...textItems);
  return items;
}

function setLayout(items: MessageItem[], layout: MessageLayout): Message {
  let lineY = 0;
  let lineWidth = 0;
  const lineHeight = layout.fontHeight;
  for (const item of items) {
    if (lineWidth + item.width > layout.width) {
      lineWidth = 0;
      lineY += lineHeight + layout.linesSpacing;
    }
    item.x = lineWidth;
    item.y = lineY;
    if (layout.itemsVerticalAlign === "center") {
      item.y += lineHeight / 2 - item.height / 2;
    } else if (layout.itemsVerticalAlign === "bottom") {
      item.y += lineHeight - item.height;
    }
    lineWidth += item.width + layout.itemsSpacing;
  }
  return new Message(items, layout.width, lineY + lineHeight);
}
