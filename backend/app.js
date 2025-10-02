import express from "express";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const port = 4000;

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  console.log("File saved:", req.file);

  const formData = new FormData();
  formData.append("file", fs.createReadStream(req.file.path));

  const response = await axios.post("http://whisper:8000/transcribe", formData, {
    headers: formData.getHeaders(),
  });

  res.json(response.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
