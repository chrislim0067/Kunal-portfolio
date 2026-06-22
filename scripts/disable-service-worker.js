const fs = require('fs');
const p = require('path').join(__dirname, '..', 'main.be139ff41f386a5b9c64.js');
let js = fs.readFileSync(p, 'utf8');

// Disable Angular service worker (was caching old production bundle on F5)
const swRegister = 'register("ngsw-worker.js",{enabled:r,registrationStrategy:"registerImmediately"})';
const swDisabled = 'register("ngsw-worker.js",{enabled:!1,registrationStrategy:"registerImmediately"})';

if (js.includes(swRegister)) {
  js = js.replace(swRegister, swDisabled);
  fs.writeFileSync(p, js);
  console.log('Service worker disabled.');
} else if (js.includes(swDisabled)) {
  console.log('Service worker already disabled.');
} else {
  console.error('Could not find SW registration string.');
  process.exit(1);
}

// Ensure name is Kunal Vaghela everywhere in bundle
if (js.includes('Gergely Gizella') || js.includes('Chris Lim')) {
  js = js.replace(/Gergely Gizella|Chris Lim/g, 'Kunal Vaghela');
  fs.writeFileSync(p, js);
  console.log('Normalized portfolio name to Kunal Vaghela in bundle.');
}
