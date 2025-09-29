import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import os from "os";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const port = 4000;

app.post("/transcribe", upload.single("audio"), (req, res) => {
  console.log("File saved:", req.file);
  const filePath = req.file.path;

  const homeDir = os.homedir();
  const relativePythonExecutablePath = "python_environments/openai-whisper/bin/python";
  const venvPython = `${homeDir}/${relativePythonExecutablePath}`;

  // Example: run a Python script inside the venv
  const process = spawn(venvPython, ["transcribe.py", filePath]);

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    res.setHeader("content-type", "application/json");
    res.json({ text: data.toString() });
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
