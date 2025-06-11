const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Utility: Run face recognition
async function runFaceRecognition(base64Image) {
  return new Promise((resolve, reject) => {
    if (!base64Image) return reject('No image provided');

    // Ensure directory exists
    const tempDir = path.join(__dirname, '../recognition');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save image temporarily
    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, '');
    const tempImagePath = path.join(tempDir, 'temp.jpg');
    fs.writeFileSync(tempImagePath, base64Data, 'base64');

    const python = spawn('python', ['recognition/recognition.py', tempImagePath]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
      fs.unlinkSync(tempImagePath); // cleanup

      if (code === 0) {
        resolve(result.trim());
      } else {
        reject('Recognition failed');
      }
    });
  });
}

// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  const { userId, name, className, streamName, facultyName, subjectName, timestamp, image } = req.body;

  if (!className || !streamName || !facultyName || !subjectName || !image) {
    return res.status(400).json({ message: 'Please fill in all required fields including image.' });
  }

  try {
    const recognitionResult = await runFaceRecognition(image);
    console.log('Recognition Result:', recognitionResult);

    if (recognitionResult !== name) {
      return res.status(403).json({ message: 'Face does not match the provided name.' });
    }

    // Save attendance
    const attendance = new Attendance({
      userId,
      name,
      className,
      streamName,
      facultyName,
      subjectName,
      timestamp,
      status: 'Present'
    });

    await attendance.save();
    res.status(200).json({ message: 'Attendance marked successfully!' });

  } catch (error) {
    console.error('Error during recognition or saving:', error);
    res.status(500).json({ message: 'Server error during recognition or saving.' });
  }
});

module.exports = router;
