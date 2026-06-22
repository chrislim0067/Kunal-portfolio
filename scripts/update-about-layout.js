const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const stylesStart = js.indexOf("selectors:[[\"app-about\"]]");
if (stylesStart < 0) {
  console.error("app-about not found");
  process.exit(1);
}
const stylesIdx = js.indexOf("styles:[", stylesStart);
const stylesEnd = js.indexOf("'],", stylesIdx) + 2;
const oldStyles = js.slice(stylesIdx, stylesEnd);

const newStyles =
  "styles:['[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden;max-height:min(90vh,560px)}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{height:220px;min-height:220px;background:#000;width:100%;background-image:url(assets/me.png);background-position:50% 15%;background-size:cover;flex-shrink:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{padding:1.1rem 1.35rem 1.35rem;flex:1;min-width:0;overflow-y:auto}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]{display:flex;align-items:center;margin-bottom:.65rem!important}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.65rem;margin:0}[_nghost-%COMP%]   .titlecol[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}[_nghost-%COMP%]   p[_ngcontent-%COMP%]{font-size:.9rem;line-height:1.5;margin-bottom:.85rem}[_nghost-%COMP%]   .skill[_ngcontent-%COMP%]{display:inline-block;margin-right:.45em;margin-bottom:.4em;font-size:.82rem}@media (min-width:768px){[_nghost-%COMP%]{flex-direction:row;align-items:stretch;max-height:min(88vh,520px)}[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{width:240px;min-width:240px;max-width:240px;height:auto;min-height:0;max-height:none;align-self:stretch;margin-bottom:0!important;flex-shrink:0}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{padding:1.35rem 1.75rem;max-height:min(88vh,520px)}}@media (min-width:992px){[_nghost-%COMP%]   .sideimg[_ngcontent-%COMP%]{width:260px;min-width:260px;max-width:260px}}[_nghost-%COMP%]   .imgcol[_ngcontent-%COMP%]{background-color:#000}[_nghost-%COMP%]   .photo[_ngcontent-%COMP%]{width:300px;height:300px;background-color:#000;border-radius:50%}']";

js = js.replace(oldStyles, newStyles);

// Remove desktop social buttons block (d-none d-md-inline wrapper)
const desktopSocial =
  '<div class="d-none d-md-inline" _ngcontent-%COMP%>';
const idxDesktop = js.indexOf('class="d-none d-md-inline"');
if (idxDesktop >= 0) {
  const start = js.lastIndexOf("<div", idxDesktop);
  let depth = 0;
  let i = start;
  for (; i < js.length; i++) {
    if (js.startsWith("<div", i)) depth++;
    if (js.startsWith("</div>", i)) {
      depth--;
      if (depth === 0) {
        i += 6;
        break;
      }
    }
  }
  js = js.slice(0, start) + js.slice(i);
  console.log("Removed desktop social block");
}

// Remove mobile social column (col-12 d-md-none)
const mobileMarker = 'class="col-12 d-md-none"';
const idxMobile = js.indexOf(mobileMarker);
if (idxMobile >= 0) {
  const start = js.lastIndexOf("<div", idxMobile);
  let depth = 0;
  let i = start;
  for (; i < js.length; i++) {
    if (js.startsWith("<div", i)) depth++;
    if (js.startsWith("</div>", i)) {
      depth--;
      if (depth === 0) {
        i += 6;
        break;
      }
    }
  }
  js = js.slice(0, start) + js.slice(i);
  console.log("Removed mobile social block");
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Updated About layout in production bundle.");
