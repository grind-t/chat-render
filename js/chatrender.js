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

    let pattern = '';
    for (name of map.keys()) {
      name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
      pattern += name + '|';
    }
    pattern = pattern.slice(0, -1); // Remove last '|'.
    this.regexp = new RegExp(pattern, 'g');
  }
}

class MessageStyle {
  constructor(authorFillStyle, messageFillStyle) {
    this.authorFillStyle = authorFillStyle;
    this.messageFillStyle = messageFillStyle;
  }
}

class MessageLayout {
  constructor(width, spacing, lineHeight, verticalAlign) {
    this.width = width;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.verticalAlign = verticalAlign;
  }

  arrange(...items) {
    let lineY = 0;
    let lineWidth = 0;
    for (const item of items) {
      if (lineWidth + item.width > this.width) {
        lineWidth = 0;
        lineY += this.lineHeight;
      }
      item.x = lineWidth;
      item.y = lineY;
      if (this.verticalAlign === 'center') {
        item.y += this.lineHeight / 2 - item.height / 2;
      } else if (this.verticalAlign === 'bottom') {
        item.y += this.lineHeight - item.height;
      }
      lineWidth += item.width + this.spacing;
    }
    const totalHeight = lineY + this.lineHeight;
    return totalHeight;
  }
}

class MessageDrawer extends Rectangle {
  constructor(width, height, authorDrawer, drawers, style) {
    super(0, 0, width, height);
    this.authorDrawer = authorDrawer;
    this.drawers = drawers;
    this.style = style;
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
    const spacing = ctx.measureText(' ').width;
    const layout = new MessageLayout(this.width, spacing, this.emotes.size, 'center');
    const fontHeight = ctx.measureText('W').actualBoundingBoxAscent;
    const authorWidth = ctx.measureText(author).width;
    const authorDrawer = new StringDrawer(author, authorWidth, fontHeight);
    const drawers = getDrawers(message, this.emotes, this.width, ctx);
    const height = layout.arrange(authorDrawer, ...drawers);
    const md = new MessageDrawer(this.width, height, authorDrawer, drawers, this.style.messageStyle);
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