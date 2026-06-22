/**
 * Extract original TypeScript/HTML sources from the production source map.
 * Only recovers files listed under ./src/ in the main bundle map.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAP_FILE = path.join(ROOT, 'main.be139ff41f386a5b9c64.js.map');
const OUT_DIR = path.join(ROOT, 'recovered-source');

const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
const { sources, sourcesContent } = map;

if (!sourcesContent || !sourcesContent.length) {
  console.error('No sourcesContent in source map — cannot recover source files.');
  process.exit(1);
}

let written = 0;
let skipped = 0;

sources.forEach((sourcePath, index) => {
  const content = sourcesContent[index];
  if (!content || !sourcePath.startsWith('./src/')) {
    skipped++;
    return;
  }

  const relative = sourcePath.replace(/^\.\//, '');
  const dest = path.join(OUT_DIR, relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  written++;
});

console.log(`Extracted ${written} app source files to ${OUT_DIR}`);
console.log(`Skipped ${skipped} non-app or empty entries`);
