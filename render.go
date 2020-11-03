package chatrender

import (
	"bufio"
	"errors"
	"image"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/disintegration/imaging"

	"github.com/fogleman/gg"
)

type drawer interface {
	draw(ctx *gg.Context, x, y float64)
}

type flexRowWrapLayout struct {
	width      float64
	spacing    float64
	rowHeight  float64
	alignItems int
}

type stringDrawer struct {
	str string
}

type imageDrawer struct {
	img image.Image
}

type block struct {
	graphics drawer
	rect     *Rectangle
}

type Rectangle struct {
	X      float64
	Y      float64
	Width  float64
	Height float64
}

type Container struct {
	blocks []*block
	Rect   *Rectangle
}

type Emoji struct {
	Name  string
	Image image.Image
}

type ChatEmojis struct {
	table         map[string]image.Image
	size          int
	namesToFields *strings.Replacer
}

type Chat struct {
	Emojis   *ChatEmojis
	Messages []*Container
	Rect     *Rectangle
}

func downloadImage(url string) (image.Image, string, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return nil, "", errors.New("Received non 200 response code")
	}
	return image.Decode(response.Body)
}

func splitLongWord(word string, width float64, ctx *gg.Context) []string {
	var words []string
	for i, end := 0, len(word)-1; i < end; i++ {
		w, _ := ctx.MeasureString(word[:i+1])
		if w <= width {
			continue
		}
		words = append(words, word[:i])
		word = word[i:]
		w, _ = ctx.MeasureString(word)
		if w <= width {
			words = append(words, word)
			break
		}
		i, end = 0, len(word)-1
	}
	return words
}

func flexRowWrap(blocks []*block, layout *flexRowWrapLayout) float64 {
	totalHeight := 0.0
	lineWidth := 0.0
	for _, b := range blocks {
		if lineWidth+b.rect.Width > layout.width {
			lineWidth = 0.0
			totalHeight += layout.rowHeight
		}
		b.rect.X, b.rect.Y = lineWidth, totalHeight
		if layout.alignItems == 1 {
			b.rect.Y += layout.rowHeight/2 - b.rect.Height/2
		} else if layout.alignItems == 2 {
			b.rect.Y += layout.rowHeight - b.rect.Height
		}
		lineWidth += b.rect.Width + layout.spacing
	}
	totalHeight += layout.rowHeight
	return totalHeight
}

func (sd *stringDrawer) draw(ctx *gg.Context, x, y float64) {
	ctx.DrawString(sd.str, x, y+ctx.FontHeight())
}

func (id *imageDrawer) draw(ctx *gg.Context, x, y float64) {
	ctx.DrawImage(id.img, int(x), int(y))
}

func (b *block) draw(ctx *gg.Context) {
	b.graphics.draw(ctx, b.rect.X, b.rect.Y)
}

func DownloadEmojis(list io.Reader) ([]*Emoji, error) {
	var emojis []*Emoji
	scanner := bufio.NewScanner(list)
	for scanner.Scan() {
		fields := strings.Fields(scanner.Text())
		name, url := fields[0], fields[1]
		img, _, err := downloadImage(url)
		if err != nil {
			return emojis, err
		}
		emojis = append(emojis, &Emoji{name, img})
	}
	if err := scanner.Err(); err != nil {
		return emojis, err
	}
	return emojis, nil
}

func DownloadEmojisFromFile(path string) ([]*Emoji, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	return DownloadEmojis(file)
}

func NewChatEmojis(emojis []*Emoji, emojiSize int) *ChatEmojis {
	table := make(map[string]image.Image, len(emojis))
	oldnew := make([]string, len(emojis)*2)
	for _, e := range emojis {
		table[e.Name] = imaging.Resize(e.Image, emojiSize, emojiSize, imaging.Lanczos)
		oldnew = append(oldnew, e.Name)
		oldnew = append(oldnew, " "+e.Name+" ")
	}
	return &ChatEmojis{
		table:         table,
		size:          emojiSize,
		namesToFields: strings.NewReplacer(oldnew...),
	}
}

func NewMessage(width float64, text string, emojis *ChatEmojis, ctx *gg.Context) *Container {
	text = emojis.namesToFields.Replace(text)
	m := &Container{Rect: &Rectangle{0, 0, width, 0}}
	for _, word := range strings.Fields(text) {
		if img, ok := emojis.Get(word); ok {
			size := img.Bounds().Size()
			w, h := float64(size.X), float64(size.Y)
			b := &block{&imageDrawer{img}, &Rectangle{0, 0, w, h}}
			m.blocks = append(m.blocks, b)
		} else if w, h := ctx.MeasureString(word); w <= width {
			b := &block{&stringDrawer{word}, &Rectangle{0, 0, w, h}}
			m.blocks = append(m.blocks, b)
		} else {
			words := splitLongWord(word, width, ctx)
			for _, word := range words {
				w, h := ctx.MeasureString(word)
				b := &block{&stringDrawer{word}, &Rectangle{0, 0, w, h}}
				m.blocks = append(m.blocks, b)
			}
		}
	}
	spaceWidth, _ := ctx.MeasureString(" ")
	layout := &flexRowWrapLayout{
		width:      m.Rect.Width,
		spacing:    spaceWidth,
		rowHeight:  float64(emojis.GetSize()),
		alignItems: 1,
	}
	m.Rect.Height = flexRowWrap(m.blocks, layout)
	return m
}

func (c *ChatEmojis) Get(name string) (image.Image, bool) {
	img, ok := c.table[name]
	return img, ok
}

func (c *ChatEmojis) GetSize() int {
	return c.size
}

func (c *Container) Draw(ctx *gg.Context) {
	for _, b := range c.blocks {
		x, y := b.rect.X, b.rect.Y
		b.rect.X, b.rect.Y = x+c.Rect.X, y+c.Rect.Y
		b.draw(ctx)
		b.rect.X, b.rect.Y = x, y
	}
}

func (c *Chat) Draw(ctx *gg.Context) {
	for _, m := range c.Messages {
		x, y := m.Rect.X, m.Rect.Y
		m.Rect.X, m.Rect.Y = x+c.Rect.X, y+c.Rect.Y
		m.Draw(ctx)
		m.Rect.X, m.Rect.Y = x, y
	}
}

func (c *Chat) Append(message string, ctx *gg.Context) {
	c.Messages = append(c.Messages, NewMessage(c.Rect.Width, message, c.Emojis, ctx))
	length := len(c.Messages)
	if length < 2 {
		return
	}
	prevMsg := c.Messages[length-2]
	currMsg := c.Messages[length-1]
	spacing := float64(c.Emojis.GetSize()) / 2.0
	currMsg.Rect.Y = prevMsg.Rect.Y + prevMsg.Rect.Height + spacing
	offset := currMsg.Rect.Y + currMsg.Rect.Height - c.Rect.Height
	if offset <= 0 {
		return
	}
	removeMessages := 0
	for _, m := range c.Messages {
		m.Rect.Y -= offset
		if m.Rect.Y+m.Rect.Height < 0 {
			removeMessages++
		}
	}
	if removeMessages > 0 {
		c.Messages = c.Messages[removeMessages:]
	}
}
