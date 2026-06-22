/* Extract per-component inlined styles from the production Ivy bundle and write
 * them back into each component's .scss file, reversing Angular's emulated
 * encapsulation placeholders:
 *   [_nghost-%COMP%]   -> :host
 *   [_ngcontent-%COMP%] -> (removed; implied by component scoping)
 */
const fs = require("fs");
const path = require("path");

const PROD_JS = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
const SRC = path.join(__dirname, "src");

/* ---- 1. Build selector -> scss path map from recovered components ---- */
function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (name.endsWith(".component.ts")) acc.push(full);
  }
  return acc;
}

const selectorToScss = {};
for (const tsFile of walk(SRC)) {
  const txt = fs.readFileSync(tsFile, "utf8");
  const selMatch = txt.match(/selector:\s*["'`]([^"'`]+)["'`]/);
  const styleMatch = txt.match(/styleUrls:\s*\[\s*["'`]([^"'`]+)["'`]/);
  if (selMatch && styleMatch) {
    const scssRel = styleMatch[1];
    const scssPath = path.resolve(path.dirname(tsFile), scssRel);
    selectorToScss[selMatch[1]] = scssPath;
  }
}

/* ---- 2. Parse production JS for selector -> styles ---- */
const js = fs.readFileSync(PROD_JS, "utf8");

// Read a JS array of double-quoted string literals starting at index of '['.
function readStringArray(str, openBracketIdx) {
  let i = openBracketIdx + 1;
  const out = [];
  while (i < str.length) {
    while (i < str.length && /\s|,/.test(str[i])) i++;
    if (str[i] === "]") {
      return { strings: out, end: i };
    }
    if (str[i] !== '"') {
      // not a string array element we understand
      return { strings: out, end: i };
    }
    // read a string literal
    i++;
    let buf = "";
    while (i < str.length) {
      const c = str[i];
      if (c === "\\") {
        buf += c + str[i + 1];
        i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        break;
      }
      buf += c;
      i++;
    }
    out.push(buf);
  }
  return { strings: out, end: i };
}

function decodeJsString(s) {
  try {
    return JSON.parse('"' + s + '"');
  } catch {
    return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
  }
}

// Find every styles:[ and associate with nearest preceding selectors:[["name"]]
const selectorToCss = {};
let idx = 0;
const stylesToken = "styles:[";
while ((idx = js.indexOf(stylesToken, idx)) !== -1) {
  const bracketIdx = idx + stylesToken.length - 1;
  const { strings } = readStringArray(js, bracketIdx);
  // find nearest preceding selectors:[["
  const back = js.lastIndexOf("selectors:[[", idx);
  if (back !== -1 && strings.length) {
    const after = js.slice(back, back + 80);
    const sm = after.match(/selectors:\[\[\s*"([^"]+)"/);
    if (sm) {
      const sel = sm[1];
      const css = strings.map(decodeJsString).join("\n");
      selectorToCss[sel] = (selectorToCss[sel] || "") + css + "\n";
    }
  }
  idx += stylesToken.length;
}

/* ---- 3. Transform & write ---- */
function globalizeToScoped(css) {
  return css
    .replace(/\[_nghost-%COMP%\]/g, ":host")
    .replace(/\[_ngcontent-%COMP%\]/g, "")
    .replace(/_nghost-%COMP%/g, "")
    .replace(/_ngcontent-%COMP%/g, "");
}

let written = 0;
const report = [];
for (const [sel, scssPath] of Object.entries(selectorToScss)) {
  const css = selectorToCss[sel];
  if (css) {
    const scoped = globalizeToScoped(css);
    fs.writeFileSync(scssPath, `/* Recovered from production bundle for ${sel} */\n` + scoped, "utf8");
    written++;
    report.push(`OK   ${sel}  (${scoped.length} chars) -> ${path.relative(SRC, scssPath)}`);
  } else {
    report.push(`MISS ${sel}  (no styles found in bundle)`);
  }
}

console.log(report.join("\n"));
console.log(`\nWrote styles for ${written}/${Object.keys(selectorToScss).length} components.`);
console.log("Selectors in bundle but not matched to a component:");
console.log(Object.keys(selectorToCss).filter((s) => !selectorToScss[s]).join(", ") || "(none)");
