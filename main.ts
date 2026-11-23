// World-news image entry (Node 22, standard library only): the image is the
// entry.png beside this file, and the program copies it to /output/entry.png.
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels,
// and the judge sees exactly the bytes copied. The program runs with no
// network, so the image is carried in the repository itself.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function handOverImage() {
  const source = new URL('./entry.png', import.meta.url);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const target = join(outDir, 'entry.png');
  if (!existsSync(source)) {
    console.error('entry.png is missing from the repository');
    process.exit(1);
  }
  const bytes = readFileSync(source);
  if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
    console.error('entry.png is not a PNG (bad magic bytes)');
    process.exit(1);
  }
  if (bytes.length > 1048576) {
    console.error('entry.png is over the 1 MiB gate limit');
    process.exit(1);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width > 1024 || height > 1024) {
    console.error(`entry.png is ${width}x${height}, over the 1024x1024 gate limit`);
    process.exit(1);
  }
  copyFileSync(source, target);
  return { target, size: bytes.length };
}

const done = handOverImage();
console.log(`wrote ${done.target} (${done.size} bytes)`);
