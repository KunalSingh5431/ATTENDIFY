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
    image, 
    semester,
    streamName,
    facultyName,
    subjectName,
    timestamp
  } = req.body;

  // Validation
  if (!image || !semester || !streamName || !facultyName || !subjectName) {
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
      semester,
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
      semester,
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

router.get('/get-all', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
});
router.get('/get-by-semester', async (req, res) => {
  const semester = req.query.semester;
  try {
    const data = await Attendance.find({ semester }); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/attendance/student/:userId
router.get('/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Attendance.find({ userId }).sort({ timestamp: -1 });

    const formatted = records.map(record => ({
      date: new Date(record.timestamp).toLocaleDateString('en-IN'),
      status: record.status,
      time: new Date(record.timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      subjectName: record.subjectName || 'N/A',
      facultyName: record.facultyName || 'N/A'
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ Error fetching student attendance:', error);
    res.status(500).json({ message: 'Failed to get student attendance' });
  }
});


module.exports = router;
