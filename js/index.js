function readTextFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadEmotes(list, size) {
  const map = new Map();
  for (const line of list.match(/[^\r\n]+/g)) {
    const fields = line.match(/\S+/g);
    const name = fields[0];
    const url = fields[1];
    const img = new Image(size, size);
    img.crossOrigin = 'anonymous';
    img.src = url;
    map.set(name, img);
  }
  return new Emotes(map, size);
}

function getRecords(csvFile) {
  return new Promise((resolve, reject) => {
    const records = [];
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
}

async function render(records, chat, canvas, font) {
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const zip = new JSZip();
  const ffmpegScript = ['ffconcat version 1.0'];
  records.push(records[records.length - 1]);
  for (let i = 0; i < records.length - 1; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chat.append(records[i].author, records[i].message, ctx);
    chat.draw(ctx, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const filepath = `img/${i}.png`;
    zip.file(filepath, blob);
    ffmpegScript.push(`file ${filepath}`);
    const duration = (records[i + 1].timestamp - records[i].timestamp) / 1000000;
    ffmpegScript.push(`duration ${duration}`);
  }
  records.pop();
  zip.file('script.txt', ffmpegScript.join('\n'));
  zip.generateAsync({ type: 'blob' }).then((content) =>
    saveAs(content, 'render.zip')
  );
}

async function main() {
  const configForm = document.forms.config;
  const width = parseFloat(configForm.width.value);
  const height = parseFloat(configForm.height.value);
  const messagesSpacing = parseFloat(configForm.messagesSpacing.value);
  const bgFillStyle = configForm.bgFillStyle.value;
  const font = configForm.font.value;
  const emotesSize = parseFloat(configForm.emotesSize.value);
  const authorFillStyle = configForm.authorFillStyle.value;
  const messageFillStyle = configForm.messageFillStyle.value;
  const emotesFile = configForm.emotes.files[0];
  const messagesFile = configForm.messages.files[0];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const messageStyle = new MessageStyle(authorFillStyle, messageFillStyle);
  const chatStyle = new ChatStyle(bgFillStyle, messageStyle);
  const emotesList = await readTextFileAsync(emotesFile);
  const emotes = downloadEmotes(emotesList, emotesSize);
  const chat = new ChatDrawer(width, height, emotes, messagesSpacing, chatStyle);
  const records = await getRecords(messagesFile);
  configForm.remove();
  document.body.append(canvas);
  render(records, chat, canvas, font);
}
