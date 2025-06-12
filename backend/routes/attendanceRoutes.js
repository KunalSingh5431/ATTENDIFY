const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/user-model');

// Utility: Run face recognition
async function runFaceRecognition(capturedImage, savedImage) {
  return new Promise((resolve, reject) => {
    try {
      const recognitionScriptPath = path.join(__dirname, '../recognition/recognition.py');
      const python = spawn('C:\\Program Files\\Python312\\python.exe', [recognitionScriptPath, capturedImage, savedImage]);

      let result = '';
      python.stdout.on('data', (data) => {
        result += data.toString();
      });

      python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      python.on('close', (code) => {
        if (code === 0) {
          resolve(result.trim());
        } else {
          reject('Recognition script failed');
        }
      });
    } catch (err) {
      reject('Error running recognition');
    }
  });
}

router.post('/verify', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imagePath = path.join(__dirname, '../temp_input.jpg');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(imagePath, base64Data, { encoding: 'base64' });

    const scriptPath = path.join(__dirname, '../recognition/recognition.py');
    const python = spawn('C:\\Program Files\\Python312\\python.exe', [scriptPath, imagePath]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    python.on('close', async (code) => {
      console.log('Python script closed with code', code);
      result = result.trim();

      if (!result || result === 'Unknown') {
        return res.status(401).json({ message: 'Face not recognized' });
      }

      const user = await User.findOne({ name: result });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Face verified successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error('Verification error:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

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
