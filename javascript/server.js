const App = require("./utils/app");
const app = new App();

app.get("/login_webview", async (req, res) => {
  await res.render("loginWebview");
});

app.get("/page_webview", async (req, res) => {
  await res.render("pageWebview");
});

app.get("/api/data", async (req, res) => {
  res.json({a: 1, b: 2});
});

app.run(3000, err => console.log(err || "run in 3000"));

