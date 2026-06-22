const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx > 0) {
  js = js.slice(webpackIdx);
}

const skillsPattern = /this\.skills=\[[^\]]*\]/;
const emptySkills = "this.skills=[]";

if (!skillsPattern.test(js)) {
  if (js.includes(emptySkills)) {
    console.log("Skills already removed.");
    process.exit(0);
  }
  console.error("About skills array not found in bundle.");
  process.exit(1);
}

js = js.replace(skillsPattern, emptySkills);

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle start invalid after patch.");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Removed all About skills from production bundle.");
