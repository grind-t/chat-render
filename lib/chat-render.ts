import { ChatSettings } from "./chat-settings.ts";
import { Chat, MessageLayout } from "./chat.ts";
import { Emotes, Message } from "./message.ts";
import ffmpegWASM from "https://cdn.skypack.dev/@ffmpeg/ffmpeg";
import { CanvasFont } from "./font.ts";

function save(content: BlobPart, fileName: string, mimeType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: mimeType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

export default async function renderChat(
  canvas: HTMLCanvasElement,
  settings: ChatSettings,
  mimeType: string,
) {
  const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
  const properties = settings.properties;
  const data = settings.data;
  ctx.font = properties.font;
  const font = new CanvasFont(ctx);
  const messageLayout = new MessageLayout(
    properties.width,
    properties.lineHeight,
    font.measureText(" ").width,
  );
  const records = settings.data.messages;
  const chat = new Chat(properties.width, properties.height);
  const { createFFmpeg, fetchFile } = ffmpegWASM;
  const ffmpeg = createFFmpeg();
  await ffmpeg.load();
  const ffmpegScript = ["ffconcat version 1.0"];
  records.push(records[records.length - 1]);
  for (let i = 0; i < records.length - 1; i++) {
    const text = `${records[i].author} ${records[i].message}`;
    const message = Message.fromText(text, font, messageLayout, data.emotes);
    chat.push(message, properties.messagesSpacing);
    chat.draw(ctx, 0, 0, properties.style);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const fileName = `${i}.png`;
    ffmpeg.FS("writeFile", fileName, await fetchFile(blob));
    ffmpegScript.push(`file ${fileName}`);
    const duration = (records[i + 1].timestamp - records[i].timestamp) /
      1000000;
    ffmpegScript.push(`duration ${duration}`);
  }
  records.pop();
  ffmpeg.FS("writeFile", "script.txt", ffmpegScript.join("\n"));
  const [type, subtype] = mimeType.split("/");
  const fileName = `out.${subtype}`;
  await ffmpeg.run(
    "-f",
    "concat",
    "-i",
    "script.txt",
    "-vsync",
    "vfr",
    "-pix_fmt",
    "yuv420p",
    fileName,
  );
  const result = ffmpeg.FS("readFile", fileName);
  save(result, fileName, mimeType);
}
