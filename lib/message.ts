/// <reference no-default-lib="true" />
/// <reference lib="dom" />

import { Font } from "./font.ts";
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
  constructor(
    public width: number,
    public lineHeight: number,
    public itemsSpacing: number,
    public itemsVerticalAlign: "bottom" | "center" | "top" = "center",
  ) {}
}

export class MessageStyle {
  constructor(
    public authorFillStyle: string,
    public messageFillStyle: string,
  ) {}
}

export class Message extends Rectangle {
  constructor(
    readonly author: MessageItem,
    readonly content: ReadonlyArray<MessageItem>,
    width: number,
    height: number,
  ) {
    super(0, 0, width, height);
  }

  static fromText(
    author: string,
    text: string,
    font: Font,
    layout: MessageLayout,
    emotes?: Emotes,
  ): Message {
    const authorItem = new TextItem(
      author,
      font.measureText(author).width,
      font.height,
    );
    const content = emotes
      ? parseTextWithEmotes(text, font, layout.width, emotes)
      : parseText(text, font, layout.width);
    return Message.withLayout(authorItem, content, layout);
  }

  static withLayout(
    author: MessageItem,
    content: MessageItem[],
    layout: MessageLayout,
  ): Message {
    const items = [author, ...content];
    let lineY = 0;
    let lineWidth = 0;
    for (const item of items) {
      if (item.width <= 0) continue;
      if (lineWidth + item.width > layout.width) {
        lineWidth = 0;
        lineY += layout.lineHeight;
      }
      item.x = lineWidth;
      item.y = lineY;
      if (layout.itemsVerticalAlign === "center") {
        item.y += layout.lineHeight / 2 - item.height / 2;
      } else if (layout.itemsVerticalAlign === "bottom") {
        item.y += layout.lineHeight - item.height;
      }
      lineWidth += item.width + layout.itemsSpacing;
    }
    const height = lineY + layout.lineHeight;
    return new Message(author, content, layout.width, height);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    style: MessageStyle,
  ) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.fillStyle = style.authorFillStyle;
    this.author.draw(ctx, x, y);
    ctx.fillStyle = style.messageFillStyle;
    this.content.forEach((item) => item.draw(ctx, x, y));
  }
}

function splitLongWord(
  word: string,
  font: Font,
  lineWidth: number,
): TextItem[] {
  const items: TextItem[] = [];
  const wordIter = word[Symbol.iterator]();
  let currentChunk = wordIter.next().value;
  let currentWidth = font.measureText(currentChunk).width;
  for (const char of wordIter) {
    const nextChunk = currentChunk + char;
    const nextWidth = font.measureText(nextChunk).width;
    if (nextWidth > lineWidth) {
      items.push(new TextItem(currentChunk, currentWidth, font.height));
      currentChunk = char;
      currentWidth = font.measureText(currentChunk).width;
    } else {
      currentChunk = nextChunk;
      currentWidth = nextWidth;
    }
  }
  items.push(new TextItem(currentChunk, currentWidth, font.height));
  return items;
}

function parseText(
  text: string,
  font: Font,
  lineWidth: number,
): TextItem[] {
  const items: TextItem[] = [];
  const words = text.match(/\S+/g);
  if (!words) return items;
  for (const word of words) {
    const item = new TextItem(word, font.measureText(word).width, font.height);
    if (item.width <= lineWidth) items.push(item);
    else items.push(...splitLongWord(item.content, font, lineWidth));
  }
  return items;
}

function parseTextWithEmotes(
  text: string,
  font: Font,
  lineWidth: number,
  emotes: Emotes,
): MessageItem[] {
  const items: MessageItem[] = [];
  const emotesMatches = text.matchAll(emotes.regexp);
  let textIdx = 0;
  for (const emoteMatch of emotesMatches) {
    const textChunk = text.slice(textIdx, emoteMatch.index);
    const textItems = parseText(textChunk, font, lineWidth);
    if (textItems) items.push(...textItems);
    const emoteName = emoteMatch[0];
    const emoteImage = <HTMLImageElement> emotes.map.get(emoteName);
    items.push(new ImageItem(emoteImage));
    textIdx += textChunk.length + emoteName.length;
  }
  const lastChunk = text.slice(textIdx, text.length);
  const textItems = parseText(lastChunk, font, lineWidth);
  if (textItems) items.push(...textItems);
  return items;
}
