import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Routes/Sidebar';
import Topbar from '../../components/Routes/Topbar';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  Alert,
  Divider,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjectWiseData, setSubjectWiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [semester, setSemester] = useState('');
  const [streamName, setStreamName] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [cameraStarted, setCameraStarted] = useState(false);
  const [imageData, setImageData] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [marking, setMarking] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const userObj = JSON.parse(storedUser);
    setUser(userObj);
    const userId = userObj.id || userObj._id;

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/attendance/student/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAttendanceData(data);
        }

        const subjectsMap = {};
        data.forEach(entry => {
          if (!subjectsMap[entry.subjectName]) {
            subjectsMap[entry.subjectName] = { present: 0, total: 0 };
          }
          subjectsMap[entry.subjectName].total += 1;
          if (entry.status === 'Present') {
            subjectsMap[entry.subjectName].present += 1;
          }
        });

        const subjectData = Object.entries(subjectsMap).map(([subject, values]) => ({
          subject,
          present: values.present,
          total: values.total
        }));

        setSubjectWiseData(subjectData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraStarted(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const image = canvas.toDataURL('image/jpeg');
      setImageData(image);
      setPreviewImage(image);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    stopCamera();
    setOpenDialog(false);
  };

  const handleMarkAttendance = async () => {
    if (!user) return;
    if (!semester || !streamName || !facultyName || !subjectName) return;

    setMarking(true);

    const payload = {
      userId: user.id || user._id,
      name: user.fullname,
      semester,
      streamName,
      facultyName,
      subjectName,
      timestamp: new Date().toISOString(),
      image: imageData,
    };

    try {
      const response = await fetch('http://localhost:8000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpenSnackbar(true);
        handleCloseDialog();
        setSemester('');
        setStreamName('');
        setFacultyName('');
        setSubjectName('');
        setImageData('');
        setPreviewImage('');
        const userId = user.id || user._id;
        const freshData = await fetch(`http://localhost:8000/api/attendance/student/${userId}`).then(res => res.json());
        setAttendanceData(freshData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMarking(false);
    }
  };

  const totalCollegeDays = 25;
  const presentCount = attendanceData.filter((entry) => entry.status === 'Present').length;
  const attendancePercentage = Math.round((presentCount / totalCollegeDays) * 100);
  const absentCount = totalCollegeDays - presentCount;
  const absentPercentage = Math.round((absentCount / totalCollegeDays) * 100);

  if (!user || loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="student" />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar user={user} />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, boxShadow: 8, background: 'linear-gradient(to right, #2196f3, #21cbf3)', color: '#fff', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">📊 Attendance Overview</Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold">✅ {attendancePercentage}%</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>Present this month</Typography>
                  <Typography variant="body2">❌ {absentPercentage}% Absent</Typography>
                  {attendancePercentage < 40 && <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Low attendance!</Alert>}
                </CardContent>
              </Card>
              <Button onClick={() => setShowAnalytics(!showAnalytics)} variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontWeight: 'bold', backgroundColor: '#1565c0' }}>
                📈 {showAnalytics ? 'Hide' : 'View'} Analytics
              </Button>
              {showAnalytics && (
                <Box sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 2, p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>📚 Subject-wise Attendance</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectWiseData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#4caf50" name="Present" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                  color: '#fff',
                  p: 1.3,
                  textAlign: 'center',
                  boxShadow: 10,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <CameraAltIcon
                    sx={{
                      fontSize: 64,
                      mb: 2,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.2)' },
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Face Recognition Attendance
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenDialog}
                    sx={{
                      backgroundColor: '#00e5ff',
                      color: '#000',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      borderRadius: 8,
                      '&:hover': {
                        backgroundColor: '#00bcd4',
                      },
                    }}
                  >
                    📸 Mark Your Attendance
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>Attendance marked successfully!</Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            📋 Fill Attendance Details
            <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField label="Semester" variant="outlined" value={semester} onChange={(e) => setSemester(e.target.value)} fullWidth />
              <TextField label="Stream Name" variant="outlined" value={streamName} onChange={(e) => setStreamName(e.target.value)} fullWidth />
              <TextField label="Faculty Name" variant="outlined" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} fullWidth />
              <TextField label="Subject Name" variant="outlined" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} fullWidth />
              <div style={{ textAlign: 'center' }}>
                {!cameraStarted && <Button variant="contained" onClick={startCamera}>Start Camera</Button>}
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      display: cameraStarted ? 'block' : 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                {cameraStarted && <Button onClick={captureImage} sx={{ mt: 1 }}>📸 Capture</Button>}
                {previewImage && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={previewImage}
                      alt="Captured"
                      style={{
                        width: '80%',
                         maxWidth: '350px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    />
                  </Box>
                )}
              </div>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
            <Button variant="contained" onClick={handleMarkAttendance} color="primary" sx={{ borderRadius: 8 }} disabled={!user || !imageData || marking}>
              {marking ? 'Marking...' : '📸 Mark Attendance'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentDashboard;



