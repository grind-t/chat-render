# go version
Can't handle text emojis https://github.com/golang/freetype/issues/45

# web version
Not tested yet

## YouTube live chat channel emojis

```javascript
Array.from(document.querySelectorAll('img[role="option"][class*="emoji"][aria-label^=":"]').values()).slice(0, 20).map(e => e.getAttribute('aria-label') + ' ' + e.getAttribute('src')).join('\n');
```

## Example file with chat emojis

## Example file with chat messages
