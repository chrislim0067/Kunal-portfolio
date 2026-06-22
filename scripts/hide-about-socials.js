const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const needle =
  "[_nghost-%COMP%]   .photo[_ngcontent-%COMP%]{width:300px;height:300px;background-color:#000;border-radius:50%}']";
const insert =
  "[_nghost-%COMP%]   .photo[_ngcontent-%COMP%]{width:300px;height:300px;background-color:#000;border-radius:50%}[_nghost-%COMP%]   .d-none.d-md-inline[_ngcontent-%COMP%],[_nghost-%COMP%]   .col-12.d-md-none[_ngcontent-%COMP%]{display:none!important}']";

if (js.includes("d-none.d-md-inline[_ngcontent-%COMP%]{display:none")) {
  console.log("Social hide rule already present.");
} else if (!js.includes(needle)) {
  console.error("About photo style anchor not found.");
  process.exit(1);
} else {
  js = js.replace(needle, insert);
  fs.writeFileSync(mainPath, js, "utf8");
  console.log("Added social hide rule to About styles.");
}
