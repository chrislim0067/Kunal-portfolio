const fs = require("fs");
const js = fs.readFileSync(require("path").join(__dirname, "..", "main.be139ff41f386a5b9c64.js"), "utf8");

let idx = 0;
while ((idx = js.indexOf("sideimg", idx)) !== -1) {
  const chunk = js.slice(Math.max(0, idx - 120), idx + 400);
  if (chunk.includes("background") || chunk.includes("min-height") || chunk.includes("styles")) {
    console.log("---", idx, "---");
    console.log(chunk);
  }
  idx += 1;
}

idx = js.indexOf('selectors:[["app-about"]]');
console.log("\napp-about idx:", idx);
if (idx >= 0) {
  const stylesIdx = js.indexOf("styles:[", idx);
  console.log(js.slice(stylesIdx, stylesIdx + 3000));
}
