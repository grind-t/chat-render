class MessageRecord {
  /**
   * 
   * @param {string | number} timestamp 
   * @param {string} author 
   * @param {string} message 
   */
  constructor(timestamp, author, message) {
    this.timestamp = timestamp;
    this.author = author;
    this.message = message;
  }
}

/**
 * 
 * @param {File} file 
 * @returns {Promise<string>}
 */
function readTextFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * 
 * @param {File} file 
 * @returns {Promise<MessageRecord[]>}
 */
async function getRecordsFromTextFileAsync(file) {
  const text = await readTextFileAsync(file);
  const records = [];
  for (const line of text.split("\n")) {
    const fields = line.split(" ");
    if (fields.length < 3)
      continue;
    records.push(new MessageRecord(...fields));
  }
  return records;
}

/**
 * 
 * @param {File} file 
 * @returns {Promise<MessageRecord[]>}
 */
function getRecordsFromCSVFileAsync(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
}

/**
 * 
 * @param {MessageRecord[]} records 
 * @param {{table: Map<string, CanvasImageSource>, emojiSize: number}} emojiSet 
 * @param {HTMLCanvasElement} canvas 
 * @param {string} bgFillStyle 
 * @param {string} font 
 * @param {string} fontFillStyle 
 */
async function render(
  records,
  emojiSet,
  canvas,
  bgFillStyle,
  font,
  fontFillStyle,
) {
  const chat = new ChatDrawer(canvas.width, canvas.height, emojiSet);
  const zip = new JSZip();
  const ffmpegScript = ["ffconcat version 1.0"];
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  records.push(records[records.length - 1]);
  for (let i = 0; i < records.length - 1; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgFillStyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fontFillStyle;
    chat.append(`${records[i].author}: ${records[i].message}`, ctx);
    chat.draw(ctx, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const filepath = `img/${i}.png`;
    zip.file(filepath, blob);
    ffmpegScript.push(`file ${filepath}`);
    const d = (records[i + 1].timestamp - records[i].timestamp) / 1000000;
    ffmpegScript.push(`duration ${d}`);
  }
  records.pop();
  zip.file("script.txt", ffmpegScript.join("\n"));
  zip.generateAsync({ type: "blob" }).then((content) =>
    saveAs(content, "render.zip")
  );
}

async function main() {
  const configForm = document.forms.namedItem("config");
  const bgFillStyle = configForm.bgFillStyle.value;
  const fontFillStyle = configForm.fontFillStyle.value;
  const fontFamily = configForm.fontFamily.value;
  const fontSize = configForm.fontSize.value;
  const font = `${fontSize}px ${fontFamily}`;
  const canvas = document.createElement("canvas");
  canvas.width = configForm.width.value;
  canvas.height = configForm.height.value;
  const emojiList = await readTextFileAsync(configForm.emojisFile.files[0]);
  const emojiSet = downloadEmojiSet(emojiList, fontSize * 1.5);
  const messagesFile = configForm.messagesFile.files[0];
  let records = undefined;
  if (messagesFile.name.endsWith(".csv")) {
    records = await getRecordsFromCSVFileAsync(messagesFile);
  } else {
    records = await getRecordsFromTextFileAsync(messagesFile);
  }
  configForm.remove();
  document.body.append(canvas);
  render(records, emojiSet, canvas, bgFillStyle, font, fontFillStyle);
}
