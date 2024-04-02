import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());

const upload = multer({ dest: 'img/' });

app.post('/upload', upload.single('image'), (req, res) => {
    console.log("uploading image");
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");
    console.log("tempPath: ", tempPath);
    console.log("targetPath: ", targetPath);
    fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
    });
});

app.listen(3003, () => console.log("Image server listening on port 3003!"));
