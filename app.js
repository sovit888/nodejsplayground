const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client")));

app.post("/api/cmd", (req, res) => {
  const writeStream = fs.createWriteStream("./swap.js");
  writeStream.write(req.body.cmd);
  writeStream.end(() => {
    let cmd = spawn("node", ["swap.js"]);
    cmd.stdout.pipe(res);
    cmd.stderr.pipe(res);
    cmd.on("exit", () => {
      res.end();
    });
  });
});

app.listen(2000);
