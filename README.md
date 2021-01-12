# Usage

1. Prepare a file with emotes from the chat. (list of name / url pairs separated by spaces).<br>
   Sample script for getting a list of youtube live chat emotes from the browser console:

   ```javascript
   Array.from(
     document
       .querySelectorAll('img[role="option"][class*="emoji"][aria-label^=":"]')
       .values()
   )
     .slice(0, 20)
     .map((e) => e.getAttribute("aria-label") + " " + e.getAttribute("src"))
     .join("\n");
   ```

   [Sample file](https://github.com/grind-t/chat-render/blob/master/example/yt-emotes.txt).

2. Prepare a file with messages from the chat. (csv file with timestamp,author,message fields).<br>
   [Sample file](https://github.com/grind-t/chat-render/blob/master/example/yt-messages.csv).
3. Click the [link](https://grind-t.github.io/chat-render/), fill in the fields, upload the prepared files, and click render.<br>
   Sample result:<br>
   ![Sample result](https://github.com/grind-t/chat-render/blob/master/example/result.gif)
