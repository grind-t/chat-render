import { ChatSettings } from "./chat-settings.ts";
import { Chat, MessageLayout } from "./chat.ts";
import JSZip from "https://cdn.skypack.dev/jszip";
import saveAs from "https://cdn.skypack.dev/file-saver";
import { Emotes, Message } from "./message.ts";

export default async function renderChat(
  canvas: HTMLCanvasElement,
  settings: ChatSettings,
) {
  const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
  const properties = settings.properties;
  const data = settings.data;
  ctx.font = properties.font;
  const messageLayout = new MessageLayout(
    ctx,
    properties.width,
    properties.linesSpacing,
  );
  const emotes = data.emotes;
  let messageFrom: (str: string) => Message;
  if (emotes) {
    messageFrom = (str: string) =>
      Message.fromStringWithEmotes(str, emotes, messageLayout, ctx);
  } else {
    messageFrom = (str: string) => Message.fromString(str, messageLayout, ctx);
  }
  const records = settings.data.messages;
  const chat = new Chat(properties.width, properties.height);
  const zip = new JSZip();
  const ffmpegScript = ["ffconcat version 1.0"];
  records.push(records[records.length - 1]);
  for (let i = 0; i < records.length - 1; i++) {
    const str = `${records[i].author} ${records[i].message}`;
    const message = messageFrom(str);
    chat.push(message, properties.messagesSpacing);
    chat.draw(ctx, 0, 0, properties.style);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const filepath = `img/${i}.png`;
    zip.file(filepath, blob);
    ffmpegScript.push(`file ${filepath}`);
    const duration = (records[i + 1].timestamp - records[i].timestamp) /
      1000000;
    ffmpegScript.push(`duration ${duration}`);
  }
  records.pop();
  zip.file("script.txt", ffmpegScript.join("\n"));
  zip.generateAsync({ type: "blob" }).then((content: any) =>
    saveAs(content, "render.zip")
  );
}
