const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

//Gets all the files present in the directory
app.get("/file", (req, res) => {
  fs.readdir(path.join(__dirname, "./file/"), (err, files) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(files);
  });
});

//Reads the data in the respective file
app.get("/file/:filename", (req, res) => {
  const filepath = path.join(__dirname, "./file/", req.params.filename);

  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.send(data);
  });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000, () => {
  console.log("Server up and running!");
});
