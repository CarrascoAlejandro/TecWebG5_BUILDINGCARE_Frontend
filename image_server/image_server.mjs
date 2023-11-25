import express from 'express';
import multer from 'multer';
import cors from 'cors';
const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ path: `/uploads/${req.file.filename}` });
});

app.listen(3003, () => console.log('Image server listening on port 3003!'));