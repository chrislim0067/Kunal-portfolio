const fs = require("fs");
const js = fs.readFileSync(require("path").join(__dirname, "..", "main.be139ff41f386a5b9c64.js"), "utf8");

const anchor = "directives:[d.a,f.a,i.j],styles:";
const a = js.indexOf(anchor);
console.log("anchor at", a);
console.log(js.slice(a, a + 1800));
console.log("\n--- after styles end ---");
const endMarker = "}']";
const e = js.indexOf(endMarker, a);
console.log("end at", e);
console.log(js.slice(e, e + 150));
