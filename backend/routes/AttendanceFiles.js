const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');
const AttendanceFile = require('../models/attendance-file');
const { uploadCSV } = require('../controllers/attendanceController');

dotenv.config();
const router = express.Router();

// Multer config
const upload = multer({ dest: 'temp/' });

/*
📌 POST /api/attendance-files/upload
Upload CSV and save to MongoDB
*/
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({ message: 'Only .csv files are allowed.' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const resultUrl = await uploadCSV(filePath, originalName);

    const attendancefile = new AttendanceFile({
      name: originalName,
      url: resultUrl,
    });

    await attendancefile.save(); // ✅ MongoDB save

    fs.unlinkSync(filePath); // Cleanup

    res.status(201).json({
      message: '✅ File uploaded and saved to database.',
      file: attendancefile,
    });
  } catch (err) {
    console.error('❌ Upload error:', err.message);
    res.status(500).json({ message: 'File upload failed.' });
  }
});

/*
📌 GET /api/attendance-files/get-attendance
Fetch all uploaded files
*/
router.get('/get-attendance', async (req, res) => {
  try {
    const files = await AttendanceFile.find().sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch attendance files.' });
  }
});

/*
📌 GET /api/attendance-files/download/:id
Download CSV by ID
*/
router.get('/download/:id', async (req, res) => {
  try {
    const file = await AttendanceFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found.' });

    const response = await axios.get(file.url, { responseType: 'stream' });

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'text/csv');
    response.data.pipe(res);
  } catch (err) {
    console.error('❌ Download error:', err.message);
    res.status(500).json({ message: 'Failed to download file.' });
  }
});

router.delete('/delete-file/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await AttendanceFile.findByIdAndDelete(id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});


module.exports = router;
