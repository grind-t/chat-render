import { ChatStyle, Emotes, MessageStyle } from "./chat.ts";
import papa from "https://cdn.skypack.dev/papaparse";

export interface ChatPropertiesFields {
  width: string;
  height: string;
  messagesSpacing: string;
  linesSpacing: string;
  emotesSize: string;
  font: string;
  backgroundFillStyle: string;
  authorFillStyle: string;
  messageFillStyle: string;
}

export interface ChatDataFields {
  messages: File;
  emotes?: File;
}

export interface ChatSettingsFields {
  properties: ChatPropertiesFields;
  data: ChatDataFields;
}

export interface ChatProperties {
  width: number;
  height: number;
  messagesSpacing: number;
  linesSpacing: number;
  emotesSize: number;
  font: string;
  style: ChatStyle;
}

export interface MessageRecord {
  timestamp: number;
  author: string;
  message: string;
}

export interface ChatData {
  messages: MessageRecord[];
  emotes?: Emotes;
}

export interface ChatSettings {
  properties: ChatProperties;
  data: ChatData;
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(<string> reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function downloadEmotes(file: File, emotesSize: number): Promise<Emotes> {
  const text = await readTextFile(file);
  const map = new Map();
  const lines = text.split("\n");
  const loading: Promise<Event>[] = [];
  for (const line of lines) {
    const fields = line.match(/\S+/g);
    if (!fields) continue;
    const [name, url] = fields;
    const img = new Image(emotesSize, emotesSize);
    loading.push(new Promise((resolve) => img.onload = resolve));
    img.crossOrigin = "anonymous";
    img.src = url;
    map.set(name, img);
  }
  await Promise.all(loading);
  return new Emotes(map);
}

function getRecords(file: File): Promise<MessageRecord[]> {
  return new Promise((resolve, reject) => {
    const records = [];
    papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => resolve(results.data),
      error: reject,
    });
  });
}

export function chatPropertiesFromFields(
  properties: ChatPropertiesFields,
): ChatProperties {
  return {
    width: parseFloat(properties.width),
    height: parseFloat(properties.height),
    messagesSpacing: parseFloat(properties.messagesSpacing),
    linesSpacing: parseFloat(properties.linesSpacing),
    emotesSize: parseFloat(properties.emotesSize),
    font: properties.font,
    style: new ChatStyle(
      properties.backgroundFillStyle,
      new MessageStyle(properties.authorFillStyle, properties.messageFillStyle),
    ),
  };
}

export async function chatSettingsFromFields(
  settings: ChatSettingsFields,
): Promise<ChatSettings> {
  const properties = chatPropertiesFromFields(settings.properties);
  const messages = await getRecords(settings.data.messages);
  console.log(messages);
  const emotes = settings.data.emotes
    ? await downloadEmotes(settings.data.emotes, properties.emotesSize)
    : undefined;
  return {
    properties: properties,
    data: {
      messages: messages,
      emotes: emotes,
    },
  };
}
