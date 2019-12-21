// TODO 实现一个http框架
const { EventEmitter } = require("events");
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs").promises;

http.createServer((req, res) => {
  url.parse(req.url).pathname
});

const REQUEST_METHOD = {
  GET: "GET",
  POST: "POST"
};

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
      if (Array.isArray(MIME_TYPE[type].rule)) {
        for (let i = 0; i < MIME_TYPE[type].rule.length; i++) {
          if (MIME_TYPE[type].rule[i].test(file)) return MIME_TYPE[type].type[i]
        }
      } else {
        if (MIME_TYPE[type].rule.test(file)) return MIME_TYPE[type].type
      }
    }
  }
  return null;
}

function isPromise (fn) {
  return (fn instanceof Promise)
}

module.exports = class App extends EventEmitter {
  constructor () {
    super();
    this.on("error", e => console.error(e));
    this.getMap = {};
    this.postMap = {};
    this.handler = this.handler.bind(this);
  }

  async handler (req, res) {
    try {
      const pathname = url.parse(req.url).pathname;
      res.render || (res.render = this.render.bind(this, res));
      res.json || (res.json = this.json.bind(this, res));
      if (getMimeType(pathname) !== null) {
        const data = await fs.readFile(CUR_PATH + pathname);
        res.writeHead(200, { "Content-type": getMimeType(pathname) });
        res.end(data);
      }

      switch (req.method) {
        case REQUEST_METHOD.GET: {
          if (this.getMap[pathname]) {
            this.getMap[pathname].forEach(cb => {
              if (isPromise(cb)) {
                cb(req, res).catch(this.emit.bind(null, "error"))
              } else {
                cb(req, res)
              }
            });
          }
          break;
        }
        case REQUEST_METHOD.POST: {
          if (this.postMap[pathname]) {
            this.postMap[pathname].forEach(cb => {
              if (isPromise(cb)) {
                cb(req, res).catch(this.emit.bind(null, "error"))
              } else {
                cb(req, res)
              }
            });
          }
          break;
        }
        default: {

        }
      }
    } catch (e) {
      this.emit("error", e)
    }
  }

  get (url, callback) {
    (this.getMap[url] || (this.getMap[url] = [])).push(callback);
  }

  post (url, callback) {
    (this.postMap[url] || (this.postMap[url] = [])).push(callback);
  }

  async render (res, view) {
    try {
      const file = await fs.readFile(`${ CUR_PATH }/views/${ view }/index.html`);
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(file);
    } catch (e) {
      this.emit("error", e)
    }
  }

  json (res, data) {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(data));
  }

  run (port, callback) {
    http.createServer(this.handler).listen(port, callback);
  }
};

