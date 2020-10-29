package chatrender

import (
	"math"
	"strings"
	"testing"

	"github.com/fogleman/gg"
)

func TestDownloadEmoji(t *testing.T) {
	url := "https://yt3.ggpht.com/aTdRHeRWrR-ziW0vb206Q8TjKAu0CN7hWm4ovlFbTfojfYMnrMVqnipS_Eo1_XQlye6w-3_vYio=w48-h48-c-k-nd"
	img, err := DownloadEmoji(url, 9)
	if err != nil {
		t.Error(err)
	}
	if size := img.Bounds().Size().Y; size != 9 {
		t.Errorf("emoji size = %d; want 9", size)
	}
}

func TestDownloadEmojis(t *testing.T) {
	emoji1 := "_roflanDovolen https://yt3.ggpht.com/VcDowB_DUTaNGEmYwZuxWiDFFKFSSyvJRMlQvWnmdYCrra4CfalTIENlHP75H6_zLKU2rG2Giw=w48-h48-c-k-nd"
	emoji2 := "_roflanZdarova https://yt3.ggpht.com/qf2k6kEmo4cgMAfmqcfL3Q-p-v8Rd3VGOfK_n5BZCVTi27X-ONtcvJ-2OZqvhw1g6z9tpUA_GQ=w48-h48-c-k-nd"
	list := strings.NewReader(emoji1 + "\n" + emoji2)
	emojis, err := DownloadEmojis(list, 9)
	if err != nil {
		t.Error(err)
	}
	if len(emojis.Table) != 2 {
		t.Errorf("table length = %d; want 2", len(emojis.Table))
	}

}

func TestSplitLongWord(t *testing.T) {
	ctx := gg.NewContext(100, 100)
	longWord := "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
	longWordWidth, _ := ctx.MeasureString(longWord)
	maxWidth := 100.0
	actual := len(splitLongWord(longWord, maxWidth, ctx))
	expected := int(math.Ceil(longWordWidth / maxWidth))
	if actual != expected {
		t.Errorf("words in long word = %d; want %d", actual, expected)
	}
}

func TestFlexRowRap(t *testing.T) {
	blocks := []*block{
		&block{rect: &Rectangle{0, 0, 40, 40}},
		&block{rect: &Rectangle{0, 0, 40, 40}},
		&block{rect: &Rectangle{0, 0, 40, 40}},
	}
	layout := &flexRowWrapLayout{
		width:     100,
		spacing:   10,
		rowHeight: 50,
	}
	height := flexRowWrap(blocks, layout)
	expected := layout.rowHeight * 2
	if height != expected {
		t.Errorf("layout height = %f; want %f", height, expected)
	}
}
