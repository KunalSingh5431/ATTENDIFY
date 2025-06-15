const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');

const handleRecognition = async (capturedImageBase64, cloudinaryUrl) => {
  if (!capturedImageBase64) throw new Error('Captured image is required.');
  if (!cloudinaryUrl) throw new Error('Cloudinary image URL is required.');

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
      const chunk = data.toString();
      console.log('[PYTHON STDOUT]:', chunk);
      result += chunk;
    });

    py.stderr.on('data', (data) => {
      const errChunk = data.toString();
      console.error('[PYTHON STDERR]:', errChunk);
      error += errChunk;
    });

    const code = await new Promise((resolve) => py.on('close', resolve));
    console.log('Python exited with code:', code);

    if (code !== 0) {
  throw new Error(`Recognition failed: ${error || result}`);
}


    return "Matched";

  } catch (err) {
    console.error('❌ Recognition error:', err.message);
    throw new Error(err.message || 'Recognition failed.');
  }
};

const saveAttendanceToCSV = async (entry) => {
  const attendanceDir = path.join(__dirname, '../recognition/Attendance');
  if (!fs.existsSync(attendanceDir)) fs.mkdirSync(attendanceDir, { recursive: true });

  const now = new Date();
  const rounded = new Date(Math.floor(now.getTime() / (30 * 60 * 1000)) * 30 * 60 * 1000);
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
    entry.status
  ].join(',') + '\n';

  if (isNewFile) {
    const headers = 'UserID,Name,Class,Stream,Faculty,Subject,Timestamp,Status\n';
    fs.writeFileSync(filePath, headers + csvLine);
  } else {
    fs.appendFileSync(filePath, csvLine);
  }

  console.log(`📁 Attendance saved to CSV: ${fileName}`);
};

module.exports = {
  handleRecognition,
  saveAttendanceToCSV
};
  