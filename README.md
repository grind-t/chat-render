# Usage
1. Prepare a file with emotes from the chat. (list of name / url pairs separated by spaces).<br>
   Sample script for getting a list of youtube live chat emojis from the browser console
   
   ```javascript
   Array.from(document.querySelectorAll('img[role="option"][class*="emoji"][aria-label^=":"]').values()).slice(0, 20).map(e => e.getAttribute('aria-label') + ' ' + e.getAttribute('src')).join('\n');
   ```
   
   [Sample file](https://github.com/grind-t/chatrender/blob/master/example/yt-emojis.txt).
2. Prepare a file with messages from the chat. (csv file with timestamp,author,message fields).<br>
   [Sample file](https://github.com/grind-t/chatrender/blob/master/example/yt-messages.csv).
3. Click the [link](https://grind-t.github.io/chatrender/), fill in the fields, upload the prepared files, and click render.
4. After some time, the archive with images and the script for ffmpeg will load.
5. Use ffmpeg to create gif/webm/mp4 etc.

       ffmpeg -f concat -i script.txt output.gif
       ffmpeg -f concat -i script.txt -vsync vfr -pix_fmt yuv420p output.mp4
       
   ![gif example](https://github.com/grind-t/chatrender/blob/master/example/result/output.gif)<br>
   [Sample result](https://github.com/grind-t/chatrender/tree/master/example/result)
