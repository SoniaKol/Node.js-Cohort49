/**
 * Exercise 3: Create an HTTP web server
 */

const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

let server = http.createServer((req, res) => {
  res.statusCode = 200;

  let path = "./";

  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      path += "index.html";
      break;
    case "/index.js":
      res.setHeader("Content-Type", "text/javascript");
      path += "index.js";
      break;
    case "/style.css":
      res.setHeader("Content-Type", "text/css");
      path += "style.css";
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(err);
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
