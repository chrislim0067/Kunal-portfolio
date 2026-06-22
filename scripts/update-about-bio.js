const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const old1 =
  "Full stack developer and illustrator with more than a decade of experience in creating interactive content for the web.";
const old2 = "Lately focusing on WebGL, Next.js and serverless technologies.";
const neu =
  "Technical leader and Senior Full-Stack software engineer with deep expertise building enterprise-grade systems across finance, carbon credit, telecommunications, and eCommerce sectors. Skilled in end-to-end architecture from front-end engineering (React, Angular, Next.js) to backend APIs (Python, Node.js, Go, PostgreSQL, MongoDB) and cloud infrastructure (AWS, Vercel, Cloudflare Workers). Known for delivering high-availability systems, accelerating operational workflows, implementing modern dev tooling, and coaching teams toward better engineering practices. Consistently drives business value through automation, performance optimization, and scalable system design.";

if (!js.includes(old1)) {
  console.error("Old About bio not found in bundle.");
  process.exit(1);
}

js = js.replace(old1, neu);
if (js.includes(old2)) {
  js = js.replace("<br />" + old2, "");
  js = js.replace(old2, "");
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Updated About bio in production bundle.");
