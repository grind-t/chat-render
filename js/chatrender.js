class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class StringDrawer extends Rectangle {
  constructor(string, width, height) {
    super(0, 0, width, height);
    this.string = string;
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.x + offsetX;
    const y = this.y + offsetY + this.height;
    ctx.fillText(this.string, x, y);
  }
}

class ImageDrawer extends Rectangle {
  constructor(image, width, height) {
    super(0, 0, width, height);
    this.image = image;
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.drawImage(this.image, x, y, this.width, this.height);
  }
}

class Emotes {
  constructor(map, size) {
    this.map = map;
    this.size = size;
    this.regexp = null;

    let pattern = [];
    for (const name of map.keys())
      pattern.push(name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'));
    this.regexp = new RegExp(pattern.join('|'), 'g');
  }
}

class MessageStyle {
  constructor(authorFillStyle, messageFillStyle) {
    this.authorFillStyle = authorFillStyle;
    this.messageFillStyle = messageFillStyle;
  }
}

class MessageLayout {
  constructor(width, wordsSpacing, linesSpacing, lineHeight, verticalAlign) {
    this.width = width;
    this.wordsSpacing = wordsSpacing;
    this.linesSpacing = linesSpacing;
    this.lineHeight = lineHeight;
    this.verticalAlign = verticalAlign;
  }

  arrange(...items) {
    let lineY = 0;
    let lineWidth = 0;
    for (const item of items) {
      if (lineWidth + item.width > this.width) {
        lineWidth = 0;
        lineY += this.lineHeight + this.linesSpacing;
      }
      item.x = lineWidth;
      item.y = lineY;
      if (this.verticalAlign === 'center') {
        item.y += this.lineHeight / 2 - item.height / 2;
      } else if (this.verticalAlign === 'bottom') {
        item.y += this.lineHeight - item.height;
      }
      lineWidth += item.width + this.wordsSpacing;
    }
    const totalHeight = lineY + this.lineHeight;
    return totalHeight;
  }
}

class MessageDrawer extends Rectangle {
  constructor(width, author, message, emotes, style, ctx) {
    super(0, 0, width, 0);
    this.authorDrawer = null;
    this.drawers = null;
    this.style = style;

    const fontHeight = ctx.measureText('W').actualBoundingBoxAscent;
    const layout = new MessageLayout(
      this.width,
      ctx.measureText(' ').width,
      0,
      emotes.size,
      'center',
    );
    const authorWidth = ctx.measureText(author).width;
    this.authorDrawer = new StringDrawer(author, authorWidth, fontHeight);
    this.drawers = getDrawers(message, emotes, this.width, ctx);
    this.height = layout.arrange(this.authorDrawer, ...this.drawers);
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.fillStyle = this.style.authorFillStyle;
    this.authorDrawer.draw(ctx, x, y);
    ctx.fillStyle = this.style.messageFillStyle;
    this.drawers.forEach(drawer => drawer.draw(ctx, x, y));
  }
}

class ChatStyle {
  constructor(backgroundFillStyle, messageStyle) {
    this.backgroundFillStyle = backgroundFillStyle;
    this.messageStyle = messageStyle;
  }
}

class ChatDrawer extends Rectangle {
  constructor(width, height, emotes, verticalSpacing, style) {
    super(0, 0, width, height);
    this.emotes = emotes;
    this.verticalSpacing = verticalSpacing;
    this.style = style;
    this.messageDrawers = [];
  }

  append(author, message, ctx) {
    const md = new MessageDrawer(
      this.width, 
      author, 
      message, 
      this.emotes,
      this.style.messageStyle,
      ctx,
    );
    this.messageDrawers.push(md);
    const length = this.messageDrawers.length;
    if (length < 2) {
      return;
    }
    const prev = this.messageDrawers[length - 2];
    const curr = this.messageDrawers[length - 1];
    curr.y = prev.y + prev.height + this.verticalSpacing;
    const outOfBounds = scrollDown(this.messageDrawers, this.y, this.y + this.height);
    this.messageDrawers.splice(0, outOfBounds);
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.x + offsetX;
    const y = this.y + offsetY;
    ctx.fillStyle = this.style.backgroundFillStyle;
    ctx.fillRect(x, y, this.width, this.height);
    this.messageDrawers.forEach(drawer => drawer.draw(ctx, x, y));
  }
}

function splitLongWord(word, maxWidth, ctx) {
  const words = [];
  for (let i = 0, end = word.length; i < end; i++) {
    let width = ctx.measureText(word.slice(0, i + 1)).width;
    if (width <= maxWidth) {
      continue;
    }
    words.push(word.slice(0, i));
    word = word.slice(i);
    width = ctx.measureText(word).width;
    if (width <= maxWidth) {
      words.push(word);
      break;
    }
    i = 0;
    end = word.length - 1;
  }
  return words;
}

function getStringDrawers(words, maxWidth, ctx) {
  if (!words) {
    return null;
  }
  const fontHeight = ctx.measureText('W').actualBoundingBoxAscent;
  const drawers = [];
  for (const word of words) {
    const width = ctx.measureText(word).width;
    if (width <= maxWidth) {
      drawers.push(new StringDrawer(word, width, fontHeight));
      continue;
    }
    const words = splitLongWord(word, maxWidth, ctx);
    for (const word of words) {
      const width = ctx.measureText(word).width;
      drawers.push(new StringDrawer(word, width, fontHeight));
    }
  }
  return drawers;
}

function getDrawers(message, emotes, maxWidth, ctx) {
  const drawers = [];
  const matches = message.matchAll(emotes.regexp);
  let i = 0;
  for (const match of matches) {
    const str = message.slice(i, match.index);
    const words = str.match(/\S+/g);
    const stringDrawers = getStringDrawers(words, maxWidth, ctx);
    if (stringDrawers) {
      drawers.push(...stringDrawers);
    }
    const img = emotes.map.get(match[0]);
    drawers.push(new ImageDrawer(img, emotes.size, emotes.size));
    i += str.length + match[0].length;
  }
  const str = message.slice(i, message.length);
  const words = str.match(/\S+/g);
  const stringDrawers = getStringDrawers(words, maxWidth, ctx);
  if (stringDrawers) {
    drawers.push(...stringDrawers);
  }
  return drawers;
}

function scrollDown(drawers, minY, maxY) {
  let outOfBounds = 0;
  const last = drawers[drawers.length - 1];
  const offset = last.y + last.height - maxY;
  if (offset <= 0) {
    return outOfBounds;
  }
  for (const drawer of drawers) {
    drawer.y -= offset;
    if (drawer.y + drawer.height <= minY) {
      outOfBounds++;
    }
  }
  return outOfBounds;
}
