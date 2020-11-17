describe('chatrender', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  it('splitLongWord', () => {
    const longword = 'w'.repeat(15);
    const width = ctx.measureText(longword).width;
    assert.strictEqual(Math.floor(width), 108);
    const maxwidth = 50;
    const wordsNumber = splitLongWord(longword, maxwidth, ctx).length;
    assert.strictEqual(wordsNumber, 3);
  });
  it('MessageLayout.arrange', () => {
    const layout = new MessageLayout(100, 5, 50);
    const rects = [
      new Rectangle(0, 0, 40, 40),
      new Rectangle(0, 0, 40, 40),
      new Rectangle(0, 0, 40, 40),
    ];
    layout.arrange(rects);
    const last = rects[rects.length - 1];
    assert.strictEqual(last.y, 50);
  });
  it('scrollDown', () => {
    const rects = [
      new Rectangle(0, 0, 0, 10),
      new Rectangle(0, 10, 0, 10),
      new Rectangle(0, 20, 0, 10),
    ];
    const minY = 10;
    const maxY = 20;
    const outOfBounds = scrollDown(rects, minY, maxY);
    assert.strictEqual(outOfBounds, 2);
  });
  it('getDrawers', () => {
    const message = 'hello world jopa';
    const emotes = new Emotes(new Map([['world', null]]), 0);
    const ctx = {
      measureText() {
        return {
          width: 0,
          actualBoundingBoxAscent: 0,
        };
      },
    };
    const drawers = getDrawers(message, emotes, Infinity, ctx);
    assert.strictEqual(drawers.length, 3);
  });
});
