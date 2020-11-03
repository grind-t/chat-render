package main

import (
	"bufio"
	"encoding/csv"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/grindevelop/chatrender"

	"github.com/fogleman/gg"
)

type messageRecord struct {
	timestamp string
	author    string
	message   string
}

var (
	width        int
	height       int
	bgColor      string
	fontPath     string
	fontSize     float64
	fontColor    string
	emojisPath   string
	messagesPath string
	outputDir    string
	imagesDir    = "images"
)

func parseFlags() {
	flag.IntVar(&width, "width", 320, "chat width")
	flag.IntVar(&height, "height", 720, "chat height")
	flag.StringVar(&bgColor, "bgcolor", "#00FF00", "chat background color")
	flag.StringVar(&fontPath, "font", "", "path to font file")
	flag.Float64Var(&fontSize, "fontsize", 12, "font size")
	flag.StringVar(&fontColor, "fontcolor", "#FFFFFF", "font color")
	flag.StringVar(&emojisPath, "emojis", "", "path to file with chat emojis")
	flag.Parse()
	messagesPath = flag.Arg(0)
	outputDir = flag.Arg(1)
	if messagesPath == "" {
		panic("missing path to file with chat messages")
	}
	if outputDir == "" {
		panic("missing output directory")
	}
}

func getRecordsTXT(file *os.File) ([]*messageRecord, error) {
	var records []*messageRecord
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		fields := strings.SplitN(scanner.Text(), " ", 3)
		records = append(records, &messageRecord{
			timestamp: fields[0],
			author:    fields[1],
			message:   fields[2],
		})
	}
	return records, scanner.Err()
}

func getRecordsCSV(file *os.File) ([]*messageRecord, error) {
	var records []*messageRecord
	reader := csv.NewReader(file)
	header, err := reader.Read()
	if err != nil {
		return records, err
	}
	timestampIdx, authorIdx, messageIdx := -1, -1, -1
	for i, field := range header {
		if strings.EqualFold(field, "timestamp") {
			timestampIdx = i
		} else if strings.EqualFold(field, "author") {
			authorIdx = i
		} else if strings.EqualFold(field, "message") {
			messageIdx = i
		}
	}
	if timestampIdx == -1 {
		return records, errors.New("missing timestamp field in csv header")
	} else if authorIdx == -1 {
		return records, errors.New("missing author field in csv header")
	} else if messageIdx == -1 {
		return records, errors.New("missing message field in csv header")
	}
	for {
		fields, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			return records, err
		}
		records = append(records, &messageRecord{
			timestamp: fields[timestampIdx],
			author:    fields[authorIdx],
			message:   fields[messageIdx],
		})
	}
	return records, nil
}

func getRecords(path string) ([]*messageRecord, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	if strings.HasSuffix(path, ".csv") {
		return getRecordsCSV(file)
	}
	return getRecordsTXT(file)
}

func getSecondsDuration(startTimestamp, endTimestamp string) (float64, error) {
	start, err := strconv.Atoi(startTimestamp)
	if err != nil {
		return 0, err
	}
	end, err := strconv.Atoi(endTimestamp)
	if err != nil {
		return 0, err
	}
	return float64(end-start) / 1000000, nil
}

func render(records []*messageRecord, ffmpegScript *bufio.Writer) error {
	defer ffmpegScript.Flush()
	fmt.Fprintln(ffmpegScript, "ffconcat version 1.0")
	ctx := gg.NewContext(width, height)
	if fontPath != "" {
		if err := ctx.LoadFontFace(fontPath, fontSize); err != nil {
			return err
		}
	}
	emojiSize := int(1.5 * ctx.FontHeight())
	var emojis []*chatrender.Emoji
	if emojisPath != "" {
		e, err := chatrender.DownloadEmojisFromFile(emojisPath)
		if err != nil {
			return err
		}
		emojis = e
	} else {
		emojis = []*chatrender.Emoji{}
	}
	chat := &chatrender.Chat{
		Rect:   &chatrender.Rectangle{0, 0, float64(width), float64(height)},
		Emojis: chatrender.NewChatEmojis(emojis, emojiSize),
	}
	recordsNumber := len(records)
	records = append(records, records[recordsNumber-1])
	for i := 0; i < recordsNumber; i++ {
		chat.Append(records[i].author+": "+records[i].message, ctx)
		ctx.SetHexColor(bgColor)
		ctx.Clear()
		ctx.SetHexColor(fontColor)
		chat.Draw(ctx)
		fileName := strconv.Itoa(i) + ".png"
		err := ctx.SavePNG(filepath.Join(outputDir, imagesDir, fileName))
		if err != nil {
			return err
		}
		fmt.Fprintln(ffmpegScript, "file", path.Join(imagesDir, fileName))
		duration, err := getSecondsDuration(records[i].timestamp, records[i+1].timestamp)
		if err != nil {
			return err
		}
		fmt.Fprintf(ffmpegScript, "duration %f", duration)
		fmt.Fprintln(ffmpegScript)
	}
	return nil
}

func main() {
	parseFlags()
	err := os.MkdirAll(filepath.Join(".", outputDir, imagesDir), os.ModePerm)
	if err != nil {
		panic(err)
	}
	ffmpegScript, err := os.Create(filepath.Join(outputDir, "script.txt"))
	if err != nil {
		panic(err)
	}
	defer ffmpegScript.Close()
	records, err := getRecords(messagesPath)
	if err != nil {
		panic(err)
	}
	err = render(records, bufio.NewWriter(ffmpegScript))
	if err != nil {
		panic(err)
	}
}
