import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/Routes/Sidebar';
import Topbar from '../../../components/Routes/Topbar';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Analytics = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar role="admin"/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {user && <Topbar user={user} />}

        <Box sx={{ mt: 4, background: '#fff3e0', p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            📈 Analytics
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#e1f5fe' }}>
                <Typography variant="h6">📊 Class A</Typography>
                <Typography>Avg Present: 24</Typography>
                <Typography>Avg Absent: 6</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff9c4' }}>
                <Typography variant="h6">📊 Class B</Typography>
                <Typography>Avg Present: 27</Typography>
                <Typography>Avg Absent: 3</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
