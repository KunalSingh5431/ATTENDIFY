const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const Attendance = require('../models/Attendance');
const {
  handleRecognition,
  saveAttendanceToCSV
} = require('../controllers/attendanceController');


// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  const {
    userId,
    name,
    image,  // base64 string from frontend
    className,
    streamName,
    facultyName,
    subjectName,
    timestamp
  } = req.body;

  // Validation
  if (!image || !className || !streamName || !facultyName || !subjectName) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Get user from DB
    const user = await User.findById(userId);
    if (!user || !user.profileImage) {
      return res.status(404).json({ message: 'User or profile image not found.' });
    }

    // Strip base64 prefix
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Face recognition
    const recognitionResult = await handleRecognition(base64Image, user.profileImage);
    if (recognitionResult !== 'Matched') {
      return res.status(401).json({ message: 'Face does not match. Unauthorized.' });
    }


    // Safety check
    if (!name) {
      return res.status(400).json({ message: 'User name is missing in database.' });
    }

    // Save to MongoDB
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

    // Also save to CSV
    await saveAttendanceToCSV({
      userId,
      name,
      className,
      streamName,
      facultyName,
      subjectName,
      timestamp,
      status: 'Present'
    });

    return res.status(200).json({
      message: '✅ Attendance marked successfully!'
    });

  } catch (err) {
    console.error('❌ Error marking attendance:', err.message);
    return res.status(500).json({
      error: err.message || 'Server error. Please try again.'
    });
  }
});

module.exports = router;
