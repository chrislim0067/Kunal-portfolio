const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx > 0) {
  js = js.slice(webpackIdx);
}

const anchor = "directives:[d.a,f.a,i.j],styles:";
const anchorIdx = js.indexOf(anchor);
if (anchorIdx < 0) {
  console.error("About component styles anchor not found.");
  process.exit(1);
}

const stylesStart = anchorIdx + anchor.length;
const endMarker = "}']";
const endIdx = js.indexOf(endMarker, stylesStart);
if (endIdx < 0) {
  console.error("Could not find end of About styles array.");
  process.exit(1);
}
const stylesEnd = endIdx + endMarker.length;
const oldStyles = js.slice(stylesStart, stylesEnd);

// Photo left, bio only on right — skills column hidden
const newStyles =
  "['[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden;height:100%;min-height:100%;max-height:min(88vh,520px)}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{height:220px;min-height:220px;background:#000;width:100%;background-image:url(assets/me.png);background-position:50% 12%;background-size:cover;flex-shrink:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{flex:1;min-width:0;padding:1.25rem 1.5rem 1.5rem;display:flex;flex-direction:column;overflow:hidden}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]{display:flex;align-items:center;flex-shrink:0;margin-bottom:1rem!important}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:2rem;margin:0;line-height:1.1}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:nth-child(2){flex:1;min-height:0;align-items:center;margin:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:nth-child(2)   .col-md-6[_ngcontent-%COMP%]:first-child{display:flex;flex-direction:column;justify-content:center;flex:0 0 100%;max-width:100%;width:100%}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:nth-child(2)   .col-md-6[_ngcontent-%COMP%]:last-child{display:none!important}[_nghost-%COMP%]   p[_ngcontent-%COMP%]{font-size:1.1rem;line-height:1.62;margin:0}[_nghost-%COMP%]   .skill[_ngcontent-%COMP%]{display:none!important}[_nghost-%COMP%]   .d-none.d-md-inline[_ngcontent-%COMP%],[_nghost-%COMP%]   .col-12.d-md-none[_ngcontent-%COMP%]{display:none!important}@media (min-width:768px){[_nghost-%COMP%]{flex-direction:row;align-items:stretch}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{width:280px;min-width:280px;max-width:280px;height:auto;min-height:100%;align-self:stretch;margin-bottom:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{padding:1.5rem 2rem}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:2.15rem}[_nghost-%COMP%]   p[_ngcontent-%COMP%]{font-size:1.14rem;line-height:1.65}}']";

if (!oldStyles.startsWith("['") || oldStyles.length < 50) {
  console.error("Unexpected About styles block; refusing to patch.");
  process.exit(1);
}

js = js.slice(0, stylesStart) + newStyles + js.slice(stylesEnd);

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle start invalid after patch.");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Patched About layout styles (" + oldStyles.length + " -> " + newStyles.length + " chars).");
