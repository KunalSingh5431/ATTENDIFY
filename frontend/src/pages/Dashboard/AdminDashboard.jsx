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
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

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

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar user={user} />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, mr: 2, color: '#1976d2' }} />
                <CardContent>
                  <Typography variant="h6">Total Students</Typography>
                  <Typography variant="h5">220</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, mr: 2, color: '#9c27b0' }} />
                <CardContent>
                  <Typography variant="h6">Total Faculty</Typography>
                  <Typography variant="h5">35</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <ClassIcon sx={{ fontSize: 40, mr: 2, color: '#ff9800' }} />
                <CardContent>
                  <Typography variant="h6">Total Classes</Typography>
                  <Typography variant="h5">12</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Summary (This Week)
            </Typography>
            <Card sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                [Graph Placeholder: Add a line/bar chart showing daily attendance]
              </Typography>
            </Card>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2">✅ New student added: John Doe</Typography>
              <Typography variant="body2">🕒 Attendance submitted by Mr. Sharma</Typography>
              <Typography variant="body2">📢 Announcement: "College closed on Friday"</Typography>
            </Card>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" color="primary">Add Student</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary">Send Notification</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success">Generate Report</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
