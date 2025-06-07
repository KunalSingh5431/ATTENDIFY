import React, { useEffect, useState } from 'react';
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

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [className, setClassName] = useState('');
  const [streamName, setStreamName] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [subjectName, setSubjectName] = useState('');

  const [attendanceData, setAttendanceData] = useState([
    { date: '2025-05-01', status: 'Present', time: '10:01 AM' },
    { date: '2025-05-02', status: 'Absent', time: '-' },
    { date: '2025-05-03', status: 'Present', time: '10:00 AM' }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMarkAttendance = async () => {
    if (!user) {
      alert('⚠️ User data is still loading. Please wait and try again.');
      return;
    }
  
    if (
      !className.trim() ||
      !streamName.trim() ||
      !facultyName.trim() ||
      !subjectName.trim()
    ) {
      alert('⚠️ Please fill in all fields.');
      return;
    }
  
    const payload = {
      userId: user._id, 
      name: user.fullname,
      className: className.trim(),
      streamName: streamName.trim(),
      facultyName: facultyName.trim(),
      subjectName: subjectName.trim(),
      timestamp: new Date().toISOString(),
    };
  
    console.log('Sending payload:', payload);
  
    try {
      const response = await fetch('http://localhost:8000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setOpenSnackbar(true);
        setOpenDialog(false);
        setClassName('');
        setStreamName('');
        setFacultyName('');
        setSubjectName('');
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        alert(error.message || 'Failed to mark attendance.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };
  

  const presentCount = attendanceData.filter((entry) => entry.status === 'Present').length;
  const total = attendanceData.length;
  const attendancePercentage = Math.round((presentCount / total) * 100);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="student" />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar user={user} />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Attendance Stats */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, boxShadow: 6, background: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">📊 Attendance Overview</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                    ✅ {attendancePercentage}% Present
                  </Typography>
                  <Typography variant="body1">
                    ❌ {100 - attendancePercentage}% Absent
                  </Typography>
                  {attendancePercentage < 75 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Your attendance is below the required limit!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Button */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  backgroundColor: '#e3f2fd',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <CardContent>
                  <CameraAltIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Face Recognition Attendance
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Click below to mark attendance using your face.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenDialog}
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#115293' }
                    }}
                    disabled={!user}
                  >
                    📸 Mark Attendance
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
            Attendance marked successfully!
          </Alert>
        </Snackbar>

        {/* Modal Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            📋 Fill Attendance Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField
                label="Class Name"
                variant="outlined"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Stream Name"
                variant="outlined"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Faculty Name"
                variant="outlined"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Subject Name"
                variant="outlined"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleMarkAttendance}
              color="primary"
              sx={{ backgroundColor: '#1976d2', borderRadius: 8 }}
              disabled={!user}
            >
              📸 Mark Attendance
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
