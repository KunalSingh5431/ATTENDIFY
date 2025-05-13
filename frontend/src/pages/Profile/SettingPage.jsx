import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Switch, FormControlLabel,
  createTheme, ThemeProvider, CssBaseline, TextField, Button
} from '@mui/material';

const SettingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#90caf9' : '#1976d2',
        },
        background: {
          default: darkMode ? '#121212' : '#f9f9f9',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
      },
      shape: {
        borderRadius: 12,
      },
      typography: {
        fontFamily: 'Roboto, sans-serif',
      },
    }), [darkMode]);

  const handleUpdate = () => {
    alert('Profile Updated!');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>⚙️ Settings</Typography>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  color="primary"
                />
              }
              label={darkMode ? "Dark Mode" : "Light Mode"}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>👤 Profile</Typography>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpdate}
            >
              Update Profile
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SettingPage;
