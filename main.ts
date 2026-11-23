// Entry program for the news-image-20261123 bounty (Node 22, stdlib only).
// It takes the entry.png stored next to this file and places a copy at
// /output/entry.png, where the grader looks for it. Before copying it checks
// the file is a real PNG, fits the 1 MiB size cap, and fits 1024 by 1024.
// No network is used; the picture travels inside the repository.
// Monday 23 November 2026 in one image: 38 stories, 6 regions plus global.
// The picture was drawn by an external model from a verified story list;
// this program only validates it and hands it over, unchanged.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import * as fs from 'node:fs';
import * as path from 'node:path';

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

function fail(message: string): never {
  throw new Error(message);
}

function main() {
  const here = new URL('./entry.png', import.meta.url);
  const destDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const dest = path.join(destDir, 'entry.png');
  if (!fs.existsSync(here)) fail('entry.png is missing');
  const data = fs.readFileSync(here);
  for (let i = 0; i < PNG_MAGIC.length; i++) {
    if (data[i] !== PNG_MAGIC[i]) fail('entry.png is not a PNG');
  }
  if (data.length > MAX_BYTES) fail('entry.png exceeds 1 MiB');
  const w = data.readUInt32BE(16);
  const h = data.readUInt32BE(20);
  if (w > MAX_SIDE || h > MAX_SIDE) fail(`entry.png is ${w}x${h}, over 1024x1024`);
  fs.copyFileSync(here, dest);
  console.log(`wrote ${dest} (${data.length} bytes)`);
}

main();
