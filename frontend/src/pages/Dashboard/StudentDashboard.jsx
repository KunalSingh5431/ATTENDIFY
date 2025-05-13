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
  Divider
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
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

  const handleMarkAttendance = () => {
    alert('Facial recognition attendance marked!');
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
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, boxShadow: 6, background: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>📊 Attendance Overview</Typography>
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
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  backgroundColor: '#e3f2fd',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardContent>
                  <CameraAltIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Face Recognition Attendance
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Click the button below to mark your attendance using facial recognition.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleMarkAttendance}
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#115293' }
                    }}
                  >
                    📸 Mark Attendance
                  </Button>
                </CardContent>
              </Card>
            </Grid>            
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
