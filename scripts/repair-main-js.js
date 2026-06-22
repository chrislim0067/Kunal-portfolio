const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx < 0) {
  console.error("webpack bundle start not found");
  process.exit(1);
}

if (webpackIdx > 0) {
  console.log("Removing", webpackIdx, "bytes of orphaned prefix");
  js = js.slice(webpackIdx);
}

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle still invalid after repair");
  process.exit(1);
}

const anchor = "directives:[d.a,f.a,i.j],styles:";
if (!js.includes(anchor)) {
  console.error("About component styles missing from bundle");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("main.js repaired. Size:", js.length);
