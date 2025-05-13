const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/upload-avatar', upload.single('file'), (req, res) => {
  try {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars' },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        return res.status(200).json({ url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
