describe("chatrender", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  it("splitLongWord", () => {
    const longword = "w".repeat(15);
    const width = ctx.measureText(longword).width;
    assert.strictEqual(Math.floor(width), 108);
    const maxwidth = 50;
    const actual = splitLongWord(longword, maxwidth, ctx).length;
    const expected = 3;
    assert.strictEqual(actual, expected);
  });
  it("flexRowWrap", () => {
    const layout = new FlexRowWrapLayout(100, 5, 50, "center");
    const blocks = [
      { rect: new Rectangle(0, 0, 40, 40) },
      { rect: new Rectangle(0, 0, 40, 40) },
      { rect: new Rectangle(0, 0, 40, 40) },
    ];
    const actual = flexRowWrap(blocks, layout);
    const expected = 100;
    assert.strictEqual(actual, expected);
  });
  it("scrollDown", () => {
    const blocks = [
      { rect: new Rectangle(0, 0, 0, 10) },
      { rect: new Rectangle(0, 10, 0, 10) },
      { rect: new Rectangle(0, 20, 0, 10) },
    ];
    const bounds = new Rectangle(0, 10, 0, 10);
    const actual = scrollDown(blocks, bounds);
    console.log(blocks);
    const expected = 2;
    assert.strictEqual(actual, expected);
  });
});
