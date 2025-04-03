const express = require('express');
const multer = require('multer');
const File = require('../model/FileSchema');
const { uploadFileToS3 } = require('../functions/awss3');
const path = require('path');
const router = express.Router();
const upload = multer();
const CodeFile = require("../model/CodeFileSchema");
const langToExt = require("../utils/langToExt");

router.post("/saveCodeFile", async (req, res) => {
  try {
    const { code, fileName, language, roomCode } = req.body;

    if (!code || !fileName || !language || !roomCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ext = langToExt[language] || "txt";
    const finalFileName = `${fileName}.${ext}`;
    const buffer = Buffer.from(code, "utf-8");
    const file_type='text/plain';
    const fileUrl = await uploadFileToS3(buffer, finalFileName,file_type);
   
    const newFile = await CodeFile.create({
      file_name: finalFileName,
      file_url: fileUrl,
      language,
      room_code: roomCode,
    });

    res.status(201).json({ message: "Code saved to S3", file: newFile });
  } catch (error) {
    console.error("Save code file error:", error);
    res.status(500).json({ message: "Failed to save code file" });
  }
});

// Get all code files for a room
router.get("/getCodeFiles/:roomCode", async (req, res) => {
  try {
    const files = await CodeFile.find({ room_code: req.params.roomCode }).sort("-upload_time");
    res.status(200).json(files);
  } catch (error) {
    console.error("Fetch code files error:", error);
    res.status(500).json({ message: "Error fetching code files" });
  }
});


// General file upload (roomCode optional)
router.post('/uploadFile', upload.single('file-upload'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'File is required' });
      }
  
      const title = req.body.title ;
      const fileExtension = path.extname(file.originalname);
      const fileName = `${title}${fileExtension}`;
      const fileType = file.mimetype;
  
      // Upload file to AWS S3 correctly using file.buffer
      const fileUrl = await uploadFileToS3(file.buffer, fileName, fileType);
  
      // Save metadata in MongoDB
      const newFile = await File.create({
        file_name: fileName,
        file_type: fileType,
        file_url: fileUrl,
        room_code: req.body.roomCode || null, // roomCode optional
      });
  
      res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ message: 'File upload failed', error });
    }
  });
  

// // Get files optionally filtered by roomCode
// router.get('/getAllData', async (req, res) => {
// //   const { roomCode } = req.query;
// //   const filter = roomCode ? { room_code: roomCode } : { room_code: null };

//   try {
//     const files = await File.find(filter).sort('-upload_time');
//     res.status(200).json(files);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching files', error });
//   }
// });

// Route to explicitly fetch files by roomCode
router.get('/getRoomFiles/:roomCode', async (req, res) => {
  try {
    const files = await File.find({ room_code: req.params.roomCode }).sort('-upload_time');
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room files', error });
  }
});

// Delete file by id
router.delete('/deleteFile/:id', async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
});

module.exports = router;
