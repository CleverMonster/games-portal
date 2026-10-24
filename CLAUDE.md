# Games portal

Static site, no build step, no dependencies. Deployed via GitHub Pages (`.nojekyll` at root so `_shared/` is served).

## Layout
- `index.html` — grid of game cards built from `games.json`, with a search box (matches title, description, tags). Inline script.
- `game.html?g=<slug>` — player page: looks up the slug in `games.json` and iframes `games/<slug>/<entry || index.html>`. Fullscreen button, aspect ratio from `aspect`.
- `style.css` — shared by the two portal pages only (dark theme tokens on `:root`). Games do not use it.
- `games.json` — the registry. A game folder that isn't listed here doesn't appear.
  Fields: `slug` (= folder name), `title`, `description`, `tags`, `aspect` (e.g. `"3/4"`), optional `entry`, optional `thumbnail`.
  With no `thumbnail`, the card shows a gradient hued from the slug plus the title's first letter (current games have none).
- `games/<slug>/index.html` — each game is one self-contained HTML file.
- `games/_shared/gl2d.js` — tiny WebGL 2D helper used by every current game (not a game; never list it in `games.json`).

## Writing a game with gl2d.js
Load with `<script src="../_shared/gl2d.js"></script>`, then `const g=GL2D({fg:'#fff'})`. API:
- Drawing: `g.clear(hex)`, `g.rect(x,y,w,h,hex,alpha?)`, `g.circle(cx,cy,r,hex,alpha?)` — colours must be `#rrggbb`.
- Size: `g.W`, `g.H` in CSS px (updated each frame). Games scale with `u=Math.min(g.W,g.H)/360`.
- Input: `g.ptr {x,y,down,type}`, callbacks `g.onDown`, `g.onUp` (pointer events, touch-friendly).
- HUD: `g.score(text)` top-left, `g.msg(html|null)` centred overlay.
- Loop: `g.loop(dt=>{…})`, `dt` capped at 0.05s.

Existing games (`dodge`, `flap`, `breakout`, `pop`) share a pattern: `state` of `idle`/`run`/`over`, tap to start, a short `lock` after game over before retry, `best` score kept in memory, a header comment naming the game and its colour style. Each has a distinct palette. They are portrait (`aspect: "3/4"`) and touch-first.

## Adding a game
1. Create `games/<slug>/index.html`.
2. Add an entry to `games.json`.
3. Preview: `python3 -m http.server 8000` → http://localhost:8000 (the portal needs a server; `fetch('games.json')` fails on `file://`).
