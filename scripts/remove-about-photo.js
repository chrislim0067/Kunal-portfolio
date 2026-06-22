/**
 * Remove developer photo from About dialog by patching compiled Angular styles in main.js.
 */
const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '..', 'main.be139ff41f386a5b9c64.js');
let js = fs.readFileSync(mainPath, 'utf8');

const sideimgStyle =
  '.sideimg[_ngcontent-%COMP%]{min-height:300px;min-width:300px;background:#000;width:100%;margin-bottom:1em;background-image:url(me.3966475956940fe5c474.jpg);background-position:50% 50%;background-size:cover}';

const sideimgHidden =
  '.sideimg[_ngcontent-%COMP%]{display:none!important;width:0!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;background:none!important}';

const sideimgMedia =
  '.sideimg[_ngcontent-%COMP%]{width:auto!important;margin-bottom:0!important}';

const sideimgMediaHidden =
  '.sideimg[_ngcontent-%COMP%]{display:none!important}';

if (!js.includes(sideimgStyle)) {
  if (js.includes(sideimgHidden)) {
    console.log('Already patched.');
    process.exit(0);
  }
  console.error('Expected sideimg style block not found — bundle may have changed.');
  process.exit(1);
}

js = js.replace(sideimgStyle, sideimgHidden);
js = js.replace(sideimgMedia, sideimgMediaHidden);

fs.writeFileSync(mainPath, js, 'utf8');
console.log('Patched main.js — About photo removed.');
