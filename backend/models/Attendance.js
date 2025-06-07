const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // optional, if you have a User model
  },
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  streamName: {
    type: String,
    required: true
  },
  facultyName: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
