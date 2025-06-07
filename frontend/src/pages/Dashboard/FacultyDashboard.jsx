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
  Divider,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import 'chart.js/auto';

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [duration, setDuration] = useState(10);
  const [isSet, setIsSet] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetDetails = async () => {
    if (selectedClass && selectedSubject && duration > 0) {
      try {
        const response = await fetch('http://localhost:8000/api/session/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: selectedClass,
            subject: selectedSubject,
            durationInMinutes: duration,
          }),
        });
  
        if (response.ok) {
          setIsSet(true);
          setOpenSnackbar(true);
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to start attendance session.');
        }
      } catch (error) {
        console.error(error);
        alert('Something went wrong.');
      }
    } else {
      alert('Please enter class, subject, and duration');
    }
  };
  

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const attendanceChartData = {
    labels: [selectedSubject || 'Subject'],
    datasets: [
      {
        label: 'Attendance %',
        data: [80],
        backgroundColor: ['#1976d2'],
        borderRadius: 10
      }
    ]
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="faculty" />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f9fafc', minHeight: '100vh' }}>
        <Topbar user={user} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Schedule */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">📅 Today's Schedule</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" sx={{ mt: 1, lineHeight: 2 }}>
                    🧠 ML 101 – <strong>9:00 AM</strong><br />
                    📊 Data Viz – <strong>11:30 AM</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">🎯 Start Attendance</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>Enter class, subject and duration</Typography>

                  <TextField
                    fullWidth
                    label="Class Name"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button variant="contained" color="primary" fullWidth onClick={handleSetDetails}>
                    Start Attendance
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
            Attendance session started successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default FacultyDashboard;
