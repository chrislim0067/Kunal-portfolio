const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx > 0) {
  js = js.slice(webpackIdx);
}

const oldSkills =
  'this.skills=[{label:"Three.js"},{label:"Next.js"},{label:"Firebase"},{label:"Angular"},{label:"React"},{label:"Node.js"},{label:"Typescript"},{label:"Photoshop"},{label:"After Effects"},{label:"Illustrator"},{label:"3ds max"},{label:"Blender"},{label:"Serverless"},{label:"Docker"},{label:"Nginx"}]';

const newSkills =
  'this.skills=[{label:"Python"},{label:"FastAPI"},{label:"LangChain"},{label:"LangGraph"},{label:"OpenAI APIs"},{label:"Claude APIs"},{label:"React"},{label:"TypeScript"},{label:"PostgreSQL"},{label:"Redis"},{label:"Kubernetes"},{label:"Docker"},{label:"AWS"},{label:"Azure OpenAI"},{label:"Vector Databases"},{label:"CI/CD"},{label:"GitHub Actions"}]';

if (!js.includes(oldSkills)) {
  if (js.includes(newSkills)) {
    console.log("Skills already updated.");
    process.exit(0);
  }
  console.error("Expected skills array not found in bundle.");
  process.exit(1);
}

js = js.replace(oldSkills, newSkills);

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle start invalid after patch.");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Updated About skills in production bundle.");
