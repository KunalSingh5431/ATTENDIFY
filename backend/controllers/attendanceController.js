const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const dotenv = require('dotenv');
const AttendanceFile = require('../models/attendance-file');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_FILES,
  api_key: process.env.CLOUDINARY_API_KEY_FILES,
  api_secret: process.env.CLOUDINARY_API_SECRET_FILES,
});

// ✅ Buffer to upload CSV (used below)
const uploadCSVBuffer = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'csv_reports',
        format: 'csv',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    const readable = new stream.PassThrough();
    readable.end(buffer);
    readable.pipe(uploadStream);
  });
};

// ✅ Upload CSV via path (if needed)
const uploadCSV = async (filePath, originalName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'csv_reports',
      public_id: originalName.replace(/\.csv$/, ''),
      format: 'csv',
    });
    return result.secure_url;
  } catch (err) {
    console.error('❌ CSV upload failed:', err.message);
    throw err;
  }
};

// 🎯 Recognition logic
const handleRecognition = async (capturedImageBase64, cloudinaryUrl) => {
  if (!capturedImageBase64 || !cloudinaryUrl)
    throw new Error('Captured image or Cloudinary URL missing.');

  try {
    const cloudImgResp = await axios.get(cloudinaryUrl, { responseType: 'arraybuffer' });
    const cloudImgBase64 = Buffer.from(cloudImgResp.data).toString('base64');

    const payload = {
      knownImage: cloudImgBase64,
      testImage: capturedImageBase64,
    };

    const py = spawn('python', ['recognition.py'], {
      cwd: path.join(__dirname, '../recognition'),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    let result = '';
    let error = '';

    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    const code = await new Promise((resolve) => py.on('close', resolve));

    if (code !== 0) throw new Error(`Recognition failed: ${error || result}`);

    return "Matched";
  } catch (err) {
    console.error('❌ Recognition error:', err.message);
    throw new Error(err.message || 'Recognition failed.');
  }
};

// ✅ Store timestamps to manage delayed uploads
const csvTimestamps = new Map();

// ✅ Attendance saving logic with delayed upload & cleanup
const saveAttendanceToCSV = async (entry) => {
  const attendanceDir = path.join(__dirname, '../recognition/Attendance');
  if (!fs.existsSync(attendanceDir)) fs.mkdirSync(attendanceDir, { recursive: true });

  const now = new Date();
  const rounded = new Date(Math.floor(now.getTime() / (7 * 60 * 1000)) * 7 * 60 * 1000);
  const formatted = rounded.toISOString().slice(0, 16).replace(/:/g, '-');
  const fileName = `attendance_${formatted}.csv`;
  const filePath = path.join(attendanceDir, fileName);

  const isNewFile = !fs.existsSync(filePath);

  const csvLine = [
    entry.userId,
    entry.name,
    entry.semester || '',
    entry.streamName,
    entry.facultyName,
    entry.subjectName,
    entry.timestamp,
    entry.status,
  ].join(',') + '\n';

  if (isNewFile) {
    const headers = 'UserID,Name,Class,Stream,Faculty,Subject,Timestamp,Status\n';
    fs.writeFileSync(filePath, headers + csvLine);

    const creationTime = new Date();
    csvTimestamps.set(fileName, creationTime);

    setTimeout(async () => {
      try {
        const buffer = fs.readFileSync(filePath);
        const cloudUrl = await uploadCSVBuffer(buffer);

        const uploadedAt = csvTimestamps.get(fileName) || new Date();

        const attendancefile = new AttendanceFile({
          name: fileName,
          url: cloudUrl,
          uploadedAt, // ✅ use correct schema key
        });
        await attendancefile.save();

        fs.unlink(filePath, (err) => {
          if (err) console.error('⚠️ Failed to delete CSV:', err.message);
          else console.log(`🧹 CSV deleted: ${filePath}`);
        });

        csvTimestamps.delete(fileName);
        console.log(`☁️ CSV uploaded & saved in DB: ${cloudUrl}`);
      } catch (err) {
        console.error('❌ CSV cloud upload failed:', err.message);
      }
    }, 10 * 60 * 1000); // ✅ 7 minutes
  } else {
    fs.appendFileSync(filePath, csvLine);
  }
};

module.exports = {
  handleRecognition,
  saveAttendanceToCSV,
  uploadCSV,
  uploadCSVBuffer,
};
