/// <reference no-default-lib="true" />
/// <reference lib="dom" />

import {
  convertPropertiesFields,
  convertSettingsFields,
  DataFields,
  PropertiesFields,
  SettingsFields,
} from "./lib/chat-settings.ts";
import drawChatSample from "./lib/chat-sample.ts";
import renderChat from "./lib/chat-render.ts";

function getPropertiesFields(): PropertiesFields {
  const settings = <HTMLFormElement> document.forms.namedItem("settings");
  const properties = <HTMLFieldSetElement> settings.properties;
  const elements = properties.elements;
  const result: any = {};
  for (let i = 0; i < elements.length; i++) {
    const element = <HTMLInputElement> elements[i];
    result[element.name] = element.value;
  }
  return result;
}

function getDataFields(): DataFields {
  const settings = <HTMLFormElement> document.forms.namedItem("settings");
  const data = <HTMLFieldSetElement> settings.data;
  const elements = data.elements;
  const result: any = {};
  for (let i = 0; i < elements.length; i++) {
    const element = <HTMLInputElement> elements[i];
    result[element.name] = (<FileList> element.files)[0];
  }
  return result;
}

function getSettingsFields(): SettingsFields {
  return {
    properties: getPropertiesFields(),
    data: getDataFields(),
  };
}

export async function updatePreview() {
  const fields = getPropertiesFields();
  const properties = convertPropertiesFields(fields);
  const canvas = <HTMLCanvasElement> document.querySelector("#chat");
  canvas.width = properties.width;
  canvas.height = properties.height;
  const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
  await drawChatSample(ctx, properties);
}

export async function render() {
  const fields = getSettingsFields();
  const settings = await convertSettingsFields(fields);
  const canvas = <HTMLCanvasElement> document.querySelector("#chat");
  renderChat(canvas, settings);
}
