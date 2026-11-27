// Builds public/og.jpg (1200x630), the default social image, in the site's own look:
// the hero's ASCII wave field, the name and the role. Deterministic: same inputs, same image.
// Run: node scripts/build-og.mjs   (needs Google Chrome and macOS `sips`; rerun when the look changes)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderWaveFrame } from '../src/lib/wave.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fonts = pathToFileURL(join(root, 'public/fonts')).href;
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const COLS = 96;
const ROWS = 24;
const frame = renderWaveFrame(2.4, null, 1.6, 1, COLS, ROWS)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:GS;src:url("${fonts}/GeneralSans-Variable.woff2") format("woff2");font-weight:200 700}
@font-face{font-family:GM;src:url("${fonts}/GeistMono-Variable.woff2") format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;background:#0b0c0b;color:#ededed;overflow:hidden}
body{font-family:GS,sans-serif;padding:60px 64px;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
pre{font-family:GM,monospace;font-size:13px;line-height:1;white-space:pre;color:#ededed;flex:1;overflow:hidden}
h1{font-size:84px;font-weight:500;letter-spacing:-.03em;line-height:1}
.row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:22px}
.role{display:flex;align-items:center;gap:16px;font-size:30px;color:#a3a3a5}
.chip{background:#f5d04a;color:#000;padding:2px 14px;font-weight:500}
.url{font-family:GM,monospace;font-size:20px;color:#8a8a8c}
</style><body><pre>${frame}</pre><h1>Emiliano Montes</h1>
<div class="row"><div class="role"><span class="chip">product designer</span><span>and engineer</span></div><div class="url">louieliet.dev</div></div></body>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
try {
  const page = join(dir, 'og.html');
  const png = join(dir, 'og.png');
  writeFileSync(page, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(page).href], { stdio: 'ignore' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', png, '--out', join(root, 'public/og.jpg')], { stdio: 'ignore' });
  console.log('public/og.jpg written');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
