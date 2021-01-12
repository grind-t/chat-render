/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

import { assertEquals } from "https://deno.land/std@/testing/asserts.ts";
import { CanvasFont } from "../lib/font.ts";
import { Emotes, Message, MessageLayout } from "../lib/message.ts";

const ctxMock = <CanvasRenderingContext2D> {
  measureText(str: string) {
    return <TextMetrics> {
      width: str.length,
      actualBoundingBoxAscent: 0,
    };
  },
};

Deno.test("Message.fromText", () => {
  const word = "word";
  const longWord = "longword";
  const text = `${longWord} ${word}`;
  const layout = new MessageLayout(7, 1, 1, "top");
  const font = new CanvasFont(ctxMock);
  const message = Message.fromText(text, font, layout);
  const items = message.content;
  console.log("\nParses the string correctly");
  assertEquals(items[0].content, "longwor");
  assertEquals(items[1].content, "d");
  assertEquals(items[2].content, "word");
  console.log("Sets the correct layout");
  assertEquals(items[0].x, 0);
  assertEquals(items[0].y, 0);
  assertEquals(items[1].x, 0);
  assertEquals(items[1].y, layout.lineHeight);
  assertEquals(items[2].x, items[1].width + layout.itemsSpacing);
  assertEquals(items[2].y, items[1].y);
});

Deno.test("Message.fromText with emotes", () => {
  const word = "word";
  const emoteName = ":emote:";
  const emoteImageMock = <HTMLImageElement> { width: 2, height: 2 };
  const emotesMap = new Map([[emoteName, emoteImageMock]]);
  const emotes = new Emotes(emotesMap);
  const text = `${word} ${emoteName}${emoteName}`;
  const layout = new MessageLayout(7, 1, 1, "top");
  const font = new CanvasFont(ctxMock);
  const message = Message.fromText(text, font, layout, emotes);
  const items = message.content;
  console.log("\nParses the string correctly");
  assertEquals(items[0].content, "word");
  assertEquals(items[1].content, emoteImageMock);
  assertEquals(items[2].content, emoteImageMock);
  console.log("Sets the correct layout");
  assertEquals(items[0].x, 0);
  assertEquals(items[0].y, 0);
  assertEquals(items[1].x, items[0].width + layout.itemsSpacing);
  assertEquals(items[1].y, 0);
  assertEquals(items[2].x, 0);
  assertEquals(items[2].y, layout.lineHeight);
});
