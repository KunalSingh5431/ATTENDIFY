const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  const { userId, name, className, streamName, facultyName, subjectName, timestamp } = req.body;

  if (!userId || !name || !className || !streamName || !facultyName || !subjectName) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    // Save attendance
    const attendance = new Attendance({
      userId,
      name,
      className,
      streamName,
      facultyName,
      subjectName,
      timestamp,
      status: 'Present' // You can adjust this depending on ML model integration later
    });

    await attendance.save();

    // Placeholder: Trigger ML model
    console.log('Triggering ML model...');
    // e.g. await runFaceRecognition(userId);

    res.status(200).json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
