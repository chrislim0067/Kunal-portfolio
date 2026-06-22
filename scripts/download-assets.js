/**
 * Download all assets listed in ngsw.json from the live site.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://logartis.info';
const NGSW = path.join(ROOT, 'ngsw.json');

function download(urlPath) {
  return new Promise((resolve, reject) => {
    const dest = path.join(ROOT, urlPath.replace(/^\//, '').replace(/\//g, path.sep));
    if (fs.existsSync(dest)) return resolve({ status: 'skip', path: urlPath });

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const file = fs.createWriteStream(dest);
    https
      .get(`${BASE_URL}${urlPath}`, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`${urlPath} -> HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve({ status: 'ok', path: urlPath })));
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  const ngsw = JSON.parse(fs.readFileSync(NGSW, 'utf8'));
  const urls = new Set();
  for (const group of ngsw.assetGroups || []) {
    for (const u of group.urls || []) urls.add(u);
  }
  for (const group of ngsw.dataGroups || []) {
    for (const u of group.urls || []) urls.add(u);
  }

  let ok = 0;
  let skip = 0;
  const failed = [];

  const list = [...urls].sort();
  console.log(`Downloading ${list.length} assets from ${BASE_URL}...`);

  for (const urlPath of list) {
    try {
      const result = await download(urlPath);
      if (result.status === 'ok') {
        ok++;
        if (ok % 25 === 0) process.stdout.write(`  ${ok} downloaded...\r`);
      } else {
        skip++;
      }
    } catch (err) {
      failed.push({ path: urlPath, error: err.message });
      console.error(`FAIL: ${urlPath} — ${err.message}`);
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${failed.length} failed`);
  if (failed.length) {
    fs.writeFileSync(path.join(ROOT, 'missing-assets.json'), JSON.stringify(failed, null, 2));
    console.log('Failed URLs written to missing-assets.json');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
