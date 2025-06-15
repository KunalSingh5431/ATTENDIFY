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
 /* IconButton,*/
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

  const StatCard = ({ icon, title, value, bgColor }) => (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
        background: `linear-gradient(135deg, ${bgColor}, #f9f9f9)`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <Box sx={{ mr: 2 }}>{icon}</Box>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar role="admin" />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar user={user} />
        <Box sx={{ p: 4 }}>
          {/* Statistics Grid */}
          <Grid container spacing={4} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<PeopleIcon sx={{ fontSize: 50, color: '#1976d2' }} />}
                title="Total Students"
                value="220"
                bgColor="#e3f2fd"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<SchoolIcon sx={{ fontSize: 50, color: '#9c27b0' }} />}
                title="Total Faculty"
                value="35"
                bgColor="#f3e5f5"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<ClassIcon sx={{ fontSize: 50, color: '#ff9800' }} />}
                title="Total Classes"
                value="12"
                bgColor="#fff3e0"
              />
            </Grid>
          </Grid>

          {/* Attendance Summary */}
          <Box mt={5}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              📈 Attendance Summary (This Week)
            </Typography>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                [Graph Placeholder: Add a line/bar chart showing daily attendance here]
              </Typography>
            </Card>
          </Box>

          {/* Recent Activities */}
          <Box mt={5}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              📝 Recent Activities
            </Typography>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 2,
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="body1" gutterBottom>
                ✅ New student added: <strong>John Doe</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                🕒 Attendance submitted by <strong>Mr. Sharma</strong>
              </Typography>
              <Typography variant="body1">
                📢 Announcement: <strong>"College closed on Friday"</strong>
              </Typography>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
