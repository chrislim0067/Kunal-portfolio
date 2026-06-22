const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx <= 0) {
  console.error("Could not find webpack bundle start.");
  process.exit(1);
}

let orphanedStyles = "";
if (js.startsWith("styles:[")) {
  orphanedStyles = js.slice(0, webpackIdx);
  js = js.slice(webpackIdx);
  console.log("Removed orphaned styles prefix from file start.");
}

const aboutStyles =
  "styles:['[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden;max-height:min(90vh,560px)}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{height:220px;min-height:220px;background:#000;width:100%;background-image:url(assets/me.png);background-position:50% 15%;background-size:cover;flex-shrink:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{padding:1.1rem 1.35rem 1.35rem;flex:1;min-width:0;overflow-y:auto}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]{display:flex;align-items:center;margin-bottom:.65rem!important}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.65rem;margin:0}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}[_nghost-%COMP%]   p[_ngcontent-%COMP%]{font-size:.9rem;line-height:1.5;margin-bottom:.85rem}[_nghost-%COMP%]   .skill[_ngcontent-%COMP%]{display:inline-block;margin-right:.45em;margin-bottom:.4em;font-size:.82rem}@media (min-width:768px){[_nghost-%COMP%]{flex-direction:row;align-items:stretch;max-height:min(88vh,520px)}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{width:240px;min-width:240px;max-width:240px;height:auto;min-height:0;max-height:none;align-self:stretch;margin-bottom:0!important;flex-shrink:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{padding:1.35rem 1.75rem;max-height:min(88vh,520px)}}@media (min-width:992px){[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{width:260px;min-width:260px;max-width:260px}}[_nghost-%COMP%]   .imgcol[_ngcontent-%COMP%]{background-color:#000}[_nghost-%COMP%]   .photo[_ngcontent-%COMP%]{width:300px;height:300px;background-color:#000;border-radius:50%}[_nghost-%COMP%]   .d-none.d-md-inline[_ngcontent-%COMP%],[_nghost-%COMP%]   .col-12.d-md-none[_ngcontent-%COMP%]{display:none!important}']";

const aboutMarker = 'selectors:[["app-about"]]';
const aboutIdx = js.indexOf(aboutMarker);
if (aboutIdx < 0) {
  console.error("app-about component not found.");
  process.exit(1);
}

const afterAbout = js.slice(aboutIdx);
if (afterAbout.includes(aboutStyles.slice(0, 40))) {
  console.log("About styles already present.");
} else {
  const insertAt = aboutIdx + aboutMarker.length;
  js = js.slice(0, insertAt) + "," + aboutStyles + js.slice(insertAt);
  console.log("Injected About styles into component definition.");
}

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle still does not start correctly.");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("main.js repaired.");
