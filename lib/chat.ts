/// <reference no-default-lib="true" />
/// <reference lib="dom" />

import Rectangle from "./rectangle.ts";
import { Message, MessageStyle } from "./message.ts";
export * from "./message.ts";

export class ChatStyle {
  constructor(
    public backgroundFillStyle: string,
    public messageStyle: MessageStyle,
  ) {}
}

export class Chat extends Rectangle {
  readonly messages: ReadonlyArray<Message>;

  constructor(width: number, height: number) {
    super(0, 0, width, height);
    this.messages = [];
  }

  private scrollDown() {
    const messages = <Message[]> this.messages;
    const minY = this.y;
    const maxY = this.y + this.height;
    const last = messages[messages.length - 1];
    const offset = last.y + last.height - maxY;
    if (offset <= 0) return;
    let outOfBounds = 0;
    for (const message of messages) {
      message.y -= offset;
      if (message.y + message.height <= minY) outOfBounds++;
    }
    messages.splice(0, outOfBounds);
  }

  push(message: Message, messagesSpacing: number) {
    const messages = <Message[]> this.messages;
    messages.push(message);
    if (messages.length < 2) return;
    const prevMessage = messages[messages.length - 2];
    message.y = prevMessage.y + prevMessage.height + messagesSpacing;
    this.scrollDown();
  }

  draw(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    style: ChatStyle,
  ) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.fillStyle = style.backgroundFillStyle;
    ctx.fillRect(x, y, this.width, this.height);
    this.messages.forEach((m) => m.draw(ctx, x, y, style.messageStyle));
  }
}
