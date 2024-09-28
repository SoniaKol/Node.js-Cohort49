const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.json());

app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }

  fs.writeFileSync(`${title}.txt`, content);
  res.send("Post created successfully");
});

app.put("/posts/:title", (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send("Content is required");
  }

  if (fs.existsSync(`${title}.txt`)) {
    fs.writeFileSync(`${title}.txt`, content);
    res.send("Post updated successfully");
  } else {
    res.status(404).send("This post does not exist");
  }
});

app.delete("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(`${title}.txt`)) {
    fs.unlinkSync(`${title}.txt`);
    res.send("Post deleted successfully");
  } else {
    res.status(404).send("This post does not exist");
  }
});

app.get("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(`${title}.txt`)) {
    const content = fs.readFileSync(`${title}.txt`, "utf-8");
    res.send(content);
  } else {
    res.status(404).send("This post does not exist");
  }
});

app.get("/blogs", (req, res) => {
  const files = fs.readdirSync("./");
  const blogTitles = files
    .filter((file) => file.endsWith(".txt"))
    .map((file) => ({
      title: file.replace(".txt", ""),
    }));
  res.send(blogTitles);
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000/"));
