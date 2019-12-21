const path = require("path");

console.log(path.resolve("./"));
const MIME_TYPE = {
  html: { rule: /\.html?$/, type: "text/html" },
  css: { rule: /\.css$/, type: "text/css" },
  js: { rule: /\.jsx?$/, type: "application/javascript" },
  img: { rule: [/\.gif$/, /\.png$/, /\.jpe?g$/], type: ["image/gif", "image/png", "image/jpeg"] },
};

const CUR_PATH = path.resolve("./");

function getMimeType (file) {
  for (let type in MIME_TYPE) {
    if (MIME_TYPE.hasOwnProperty(type)) {
      console.log(type);
      if (Array.isArray(MIME_TYPE[type].rule)) {
        for (let i = 0; i < MIME_TYPE[type].rule.length; i++) {
          if (MIME_TYPE[type].rule[i].test(file)) return MIME_TYPE[type].type[i]
        }
      } else {
        console.log(type, MIME_TYPE[type].rule);
        if (MIME_TYPE[type].rule.test(file)) return MIME_TYPE[type].type
      }
    }
  }
  return null;
}


console.log(getMimeType(undefined));
