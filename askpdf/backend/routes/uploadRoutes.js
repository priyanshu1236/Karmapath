const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

router.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        console.log("File:", req.file);

        const filePath = req.file.path;
        console.log("FilePath:", filePath);

        const dataBuffer = fs.readFileSync(filePath);

        const parser = new PDFParse({
            data: dataBuffer
        });

        const result = await parser.getText();

        console.log("========== PDF TEXT ==========");
        console.log(result.text);
        console.log("========== END TEXT ==========");

        await parser.destroy();

        res.json({
            message: "PDF received successfully",
            filename: req.file.originalname,
            filePath: filePath
        });

    } catch (err) {
        console.log("Error occurred:", err);

        res.status(500).json({
            error: "PDF file unable to process"
        });
    }
});

module.exports = router;