# WebGL game site

## Add a game
1. Put the game's exported build in `games/<slug>/` (it must have an `index.html`, or set `"entry"`).
2. Add an entry to `games.json`:
   `{"slug":"<slug>","title":"…","description":"…","thumbnail":"games/<slug>/thumb.png","tags":["…"],"aspect":"16/9"}`

## Preview locally
`python3 -m http.server 8000` then open http://localhost:8000

## Deploy
Static files only: drag the folder onto Netlify Drop, or use GitHub Pages / Cloudflare Pages / itch.io-style hosting.
Unity builds served with Brotli/gzip need host support for `Content-Encoding`; choose "Decompression Fallback" when exporting if unsure.
