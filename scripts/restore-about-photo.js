/**
 * Restore About dialog photo and point it at assets/me.png.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const mainPath = path.join(root, 'main.be139ff41f386a5b9c64.js');
let js = fs.readFileSync(mainPath, 'utf8');

const sideimgHidden =
  '.sideimg[_ngcontent-%COMP%]{display:none!important;width:0!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;background:none!important}';

const sideimgVisible =
  '.sideimg[_ngcontent-%COMP%]{min-height:300px;min-width:300px;background:#000;width:100%;margin-bottom:1em;background-image:url(assets/me.png);background-position:50% 50%;background-size:cover}';

const sideimgMediaHidden =
  '.sideimg[_ngcontent-%COMP%]{display:none!important}';

const sideimgMediaVisible =
  '.sideimg[_ngcontent-%COMP%]{width:auto!important;margin-bottom:0!important}';

if (!js.includes(sideimgHidden)) {
  if (js.includes('background-image:url(assets/me.png)')) {
    console.log('Photo already restored.');
    process.exit(0);
  }
  console.error('Expected hidden sideimg block not found.');
  process.exit(1);
}

js = js.replace(sideimgHidden, sideimgVisible);
js = js.replace(sideimgMediaHidden, sideimgMediaVisible);

fs.writeFileSync(mainPath, js, 'utf8');
console.log('Restored About photo → assets/me.png');
