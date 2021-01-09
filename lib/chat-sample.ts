/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

import { ChatProperties } from "./chat-settings.ts";
import { Chat, Emotes, Message } from "./chat.ts";
import { MessageLayout } from "./message.ts";

function nextMessageFits(
  lastMessage: Message,
  messagesSpacing: number,
  chatHeight: number,
): boolean {
  const commonHeight = lastMessage.height;
  return lastMessage.y + commonHeight + messagesSpacing + commonHeight <
    chatHeight;
}

function sampleMessage(
  sampleEmote: HTMLImageElement,
  layout: MessageLayout,
  ctx: CanvasRenderingContext2D,
): Message {
  const sampleEmoteName = ":roflanChelik:";
  const emotesMap = new Map([[sampleEmoteName, sampleEmote]]);
  const emotes = new Emotes(emotesMap);
  const str = `
    Author Lorem ipsum dolor sit amet ${sampleEmoteName}, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ${sampleEmoteName}. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
    ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat ${sampleEmoteName}
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  `;
  return Message.fromStringWithEmotes(str, emotes, layout, ctx);
}

export default async function drawChatSample(
  ctx: CanvasRenderingContext2D,
  properties: ChatProperties,
) {
  const sampleEmote = new Image(properties.emotesSize, properties.emotesSize);
  const emoteLoading = new Promise((resolve) => sampleEmote.onload = resolve);
  sampleEmote.crossOrigin = "anonymous";
  sampleEmote.src =
    "https://yt3.ggpht.com/DC086aBQNoxY0qcpdIKVTR7w9F0HxRe-OBREc74rr6PHogHaYUha9vDmkL3Pb8SrI108XNUz=w48-h48-c-k-nd";
  ctx.font = properties.font;
  const messageLayout = new MessageLayout(
    ctx,
    properties.width,
    properties.linesSpacing,
  );
  const chat = new Chat(properties.width, properties.height);
  let lastMessage = sampleMessage(sampleEmote, messageLayout, ctx);
  chat.push(lastMessage, properties.messagesSpacing);
  while (
    nextMessageFits(lastMessage, properties.messagesSpacing, properties.height)
  ) {
    lastMessage = new Message(
      lastMessage.content,
      lastMessage.width,
      lastMessage.height,
    );
    chat.push(lastMessage, properties.messagesSpacing);
  }
  await emoteLoading;
  chat.draw(ctx, 0, 0, properties.style);
}
