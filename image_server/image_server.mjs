import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());

const __dirname = path.resolve();

const dirPath = path.join(__dirname, "img");

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /**        cb(null, 'image_server/img')
     */ cb(null, "img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file.filename);
  res.json({ path: req.file.filename });
});

app.listen(3003, () => console.log("Image server listening on port 3003!"));
