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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSet, setIsSet] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSetDetails = () => {
    if (selectedClass && selectedSubject) {
      setIsSet(true);
      setOpenSnackbar(true);
    }
  };

  const attendanceChartData = {
    labels: ['ML 101', 'Data Viz', 'AI Basics'],
    datasets: [
      {
        label: 'Attendance %',
        data: [90, 75, 82],
        backgroundColor: ['#1976d2', '#388e3c', '#fbc02d'],
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

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">🎯 Set Class & Subject</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>Choose details to view class performance</Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Class</InputLabel>
                    <Select value={selectedClass} label="Class" onChange={(e) => setSelectedClass(e.target.value)}>
                      <MenuItem value="CSE A">CSE A</MenuItem>
                      <MenuItem value="CSE B">CSE B</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select value={selectedSubject} label="Subject" onChange={(e) => setSelectedSubject(e.target.value)}>
                      <MenuItem value="ML 101">ML 101</MenuItem>
                      <MenuItem value="Data Viz">Data Viz</MenuItem>
                    </Select>
                  </FormControl>

                  <Button variant="contained" color="primary" fullWidth onClick={handleSetDetails}>
                    Set Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            {isSet && (
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">📈 Attendance Overview</Typography>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        Showing data for <strong>{selectedClass}</strong> – <strong>{selectedSubject}</strong>
                      </Typography>
                      <Bar data={attendanceChartData} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, backgroundColor: '#fff8e1', boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="warning.main">⚠️ Attendance Alerts</Typography>
                      <Typography variant="body2" sx={{ mt: 1, lineHeight: 2 }}>
                        - John Doe has <strong>60%</strong> attendance in ML 101<br />
                        - Jane Smith missed last 3 Data Viz classes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">📂 Generate Reports</Typography>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        Export attendance data for record keeping
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" color="primary">Download PDF</Button>
                        <Button variant="outlined" color="secondary">Download CSV</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
            Class & Subject details set successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default FacultyDashboard;
