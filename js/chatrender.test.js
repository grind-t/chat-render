describe('splitLongWord', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    it('should split word with width 108 by 3 lines at max width 50', () => {
        const longword = "w".repeat(15);
        const width = ctx.measureText(longword).width;
        const maxwidth = 50;
        const actual = splitLongWord(longword, maxwidth, ctx).length;
        const expected = 3;
        assert.strictEqual(Math.floor(width), 108);
        assert.strictEqual(actual, expected);
    });
});

describe('flexRowWrap', () => {
    it('should return height 100 for 3 squares 40 wide and 50 row height at a maximum width of 100', () => {
        const rect = {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        };
        const rects = [rect, rect, rect];
        const maxwidth = 100;
        const rowHeight = 50;
        const actual = flexRowWrap(rects, maxwidth, 5, rowHeight, 'top');
        const expected = 100;
        assert.strictEqual(actual, expected);
    });
});