const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "..", "main.be139ff41f386a5b9c64.js");
let js = fs.readFileSync(mainPath, "utf8");

const webpackIdx = js.indexOf("(window.webpackJsonp");
if (webpackIdx > 0) {
  js = js.slice(webpackIdx);
}

// Fix missing header close tags after email link (breaks layout if omitted)
const brokenTemplate =
  'i.fc(7,"a",25,26),i.Mc(8,"kunalvaghelaca@gmail.com"),i.ec(),i.fc(16,"form",12,13),';
const fixedTemplate =
  'i.fc(7,"a",25,26),i.Mc(8,"kunalvaghelaca@gmail.com"),i.ec(),i.ec(),i.oc(),i.fc(16,"form",12,13),';

if (js.includes(brokenTemplate)) {
  js = js.replace(brokenTemplate, fixedTemplate);
  console.log("Fixed contact header closing tags.");
} else if (js.includes(fixedTemplate)) {
  console.log("Contact template already fixed.");
} else {
  console.error("Contact email template block not found.");
  process.exit(1);
}

const stylesNeedle =
  '.action-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}';
const headerStyles =
  '.contact-header[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;margin-bottom:1.25rem}.contact-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:0;font-size:1.35rem;font-weight:700}';
const emailStyles =
  '.contact-email[_ngcontent-%COMP%]{color:#000;text-decoration:none;font-size:1rem;font-weight:500;word-break:break-all}.contact-email[_ngcontent-%COMP%]:hover{text-decoration:underline}@media (min-width:1199px){.contact-email[_ngcontent-%COMP%]{font-size:1.1rem}}';

if (!js.includes(".contact-header[_ngcontent-%COMP%]")) {
  if (!js.includes(stylesNeedle)) {
    console.error("Contact styles anchor not found.");
    process.exit(1);
  }
  const insert = stylesNeedle + headerStyles + emailStyles;
  if (js.includes(".contact-email[_ngcontent-%COMP%]")) {
    js = js.replace(
      /\[\.contact-email\[_ngcontent-%COMP%\]\{[^}]+\}(\[\.contact-email\[_ngcontent-%COMP%\]:hover\{[^}]+\})?(@media \(min-width:1199px\)\{\[\.contact-email\[_ngcontent-%COMP%\]\{[^}]+\}\})?/,
      headerStyles + emailStyles
    );
  } else {
    js = js.replace(stylesNeedle, insert);
  }
  console.log("Updated contact header styles.");
}

if (!js.startsWith("(window.webpackJsonp")) {
  console.error("Bundle start invalid after patch.");
  process.exit(1);
}

fs.writeFileSync(mainPath, js, "utf8");
console.log("Contact patch complete.");
