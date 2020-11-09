/**
 * @typedef {object} Block
 * @property {Rectangle} rect
 */

class Rectangle {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class FlexRowWrapLayout {
  /**
   * 
   * @param {number} width
   * @param {number} itemsSpacing 
   * @param {number} rowHeight 
   * @param {"bottom" | "center" | "top"} itemsAlign 
   */
  constructor(width, itemsSpacing, rowHeight, itemsAlign) {
    this.width = width;
    this.itemsSpacing = itemsSpacing;
    this.rowHeight = rowHeight;
    this.itemsAlign = itemsAlign;
  }
}

class EmojiSet {
  /**
   * 
   * @param {Map<string, CanvasImageSource} table 
   * @param {number} emojiSize 
   */
  constructor(table, emojiSize) {
    this.table = table;
    this.emojiSize = emojiSize;
  }
}

class StringDrawer {
  /**
   * 
   * @param {string} str 
   * @param {Rectangle} rect 
   */
  constructor(str, rect) {
    this.str = str;
    this.rect = rect;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   */
  draw(ctx, x, y) {
    ctx.fillText(this.str, x + this.rect.x, y + this.rect.y + this.rect.height);
  }
}

class ImageDrawer {
  /**
   * 
   * @param {CanvasImageSource} img 
   * @param {Rectangle} rect 
   */
  constructor(img, rect) {
    this.img = img;
    this.rect = rect;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   */
  draw(ctx, x, y) {
    ctx.drawImage(
      this.img,
      x + this.rect.x,
      y + this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}

class MessageDrawer {
  /**
   * 
   * @param {number} width 
   * @param {string[]} fields 
   * @param {EmojiSet} emojiSet 
   * @param {CanvasRenderingContext2D} ctx 
   */
  constructor(width, fields, emojiSet, ctx) {
    const fontHeight = ctx.measureText("W").actualBoundingBoxAscent;
    this.blocks = [];
    this.rect = new Rectangle(0, 0, width, 0);
    for (const field of fields) {
      const emoji = emojiSet.table.get(field);
      if (emoji) {
        const rect = new Rectangle(0, 0, emoji.width, emoji.height);
        this.blocks.push(new ImageDrawer(emoji, rect));
        continue;
      }
      const metrics = ctx.measureText(field);
      if (metrics.width <= width) {
        const rect = new Rectangle(0, 0, metrics.width, fontHeight);
        this.blocks.push(new StringDrawer(field, rect));
        continue;
      }
      const strings = splitLongWord(field, width, ctx);
      for (const s of strings) {
        const metrics = ctx.measureText(s);
        const rect = new Rectangle(0, 0, metrics.width, fontHeight);
        this.blocks.push(new StringDrawer(field, rect));
      }
    }
    const spacing = ctx.measureText(" ").width;
    const rowHeight = emojiSet.emojiSize;
    const layout = new FlexRowWrapLayout(
      this.rect.width,
      spacing,
      rowHeight,
      "center",
    );
    const height = flexRowWrap(this.blocks, layout);
    this.rect = new Rectangle(0, 0, width, height);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   */
  draw(ctx, x, y) {
    this.blocks.forEach((b) => b.draw(ctx, x + this.rect.x, y + this.rect.y));
  }
}

class ChatDrawer {
  /**
   * 
   * @param {number} width 
   * @param {number} height 
   * @param {EmojiSet} emojiSet 
   */
  constructor(width, height, emojiSet) {
    this.rect = new Rectangle(0, 0, width, height);
    this.messages = [];
    this._emojiSet = emojiSet;
    // TODO: escape names?
    this._emojisRegExp = new RegExp(
      Array.from(emojiSet.table.keys()).join("|"),
      "g",
    );
  }

  /**
   * 
   * @param {string} message 
   * @param {CanvasRenderingContext2D} ctx 
   */
  append(message, ctx) {
    message = message.replace(this._emojisRegExp, (match) => ` ${match} `);
    this.messages.push(
      new MessageDrawer(
        this.rect.width,
        message.split(/\s+/),
        this._emojiSet,
        ctx,
      ),
    );
    const length = this.messages.length;
    if (length < 2) {
      return;
    }
    const prevMsg = this.messages[length - 2];
    const currMsg = this.messages[length - 1];
    const vSpacing = this._emojiSet.emojiSize / 2;
    currMsg.rect.y = prevMsg.rect.y + prevMsg.rect.height + vSpacing;
    this.messages.splice(0, scrollDown(this.messages, this.rect));
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   */
  draw(ctx, x, y) {
    this.messages.forEach((m) => m.draw(ctx, x + this.rect.x, y + this.rect.y));
  }
}

/**
 * 
 * @param {string} list 
 * @param {number} emojiSize 
 * @returns {EmojiSet}
 */
function downloadEmojiSet(list, emojiSize) {
  const table = new Map();
  for (const line of list.split("\n")) {
    if (!line) {
      continue;
    }
    const fields = line.split(" ");
    const name = fields[0];
    const url = fields[1];
    const img = new Image(emojiSize, emojiSize);
    img.crossOrigin = "anonymous";
    img.src = url;
    table.set(name, img);
  }
  return new EmojiSet(table, emojiSize);
}

/**
 * 
 * @param {string} word 
 * @param {number} maxwidth 
 * @param {CanvasRenderingContext2D} ctx 
 */
function splitLongWord(word, maxwidth, ctx) {
  const words = [];
  for (let i = 0, end = word.length; i < end; i++) {
    let width = ctx.measureText(word.slice(0, i + 1)).width;
    if (width <= maxwidth) {
      continue;
    }
    words.push(word.slice(0, i));
    word = word.slice(i);
    width = ctx.measureText(word).width;
    if (width <= maxwidth) {
      words.push(word);
      break;
    }
    i = 0;
    end = word.length - 1;
  }
  return words;
}

/**
 * 
 * @param {Block[]} blocks
 * @param {FlexRowWrapLayout} layout 
 * @returns {number} height
 */
function flexRowWrap(blocks, layout) {
  let totalHeight = 0;
  let lineWidth = 0;
  for (let block of blocks) {
    if (lineWidth + block.rect.width > layout.width) {
      lineWidth = 0;
      totalHeight += layout.rowHeight;
    }
    block.rect.x = lineWidth;
    block.rect.y = totalHeight;
    if (layout.itemsAlign === "center") {
      block.rect.y += layout.rowHeight / 2 - block.rect.height / 2;
    } else if (layout.itemsAlign === "bottom") {
      block.rect.y += layout.rowHeight - block.rect.height;
    }
    lineWidth += block.rect.width + layout.itemsSpacing;
  }
  totalHeight += layout.rowHeight;
  return totalHeight;
}

/**
 * 
 * @param {Block[]} blocks 
 * @param {Rectangle} bounds
 * @returns {number} out of bounds
 */
function scrollDown(blocks, bounds) {
  const last = blocks[blocks.length - 1];
  const offset = (last.rect.y + last.rect.height) - (bounds.y + bounds.height);
  if (offset <= 0) {
    return 0;
  }
  let outOfBounds = 0;
  for (const block of blocks) {
    block.rect.y -= offset;
    if (block.rect.y + block.rect.height <= bounds.y) {
      outOfBounds++;
    }
  }
  return outOfBounds;
}
