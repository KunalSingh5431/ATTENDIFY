import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem,
  ListItemText, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Sidebar from '../../../components/Routes/Sidebar';
import Topbar from '../../../components/Routes/Topbar';

const dummyUsers = [
  { name: "Alice", role: "Student" },
  { name: "Bob", role: "Student" },
  { name: "Prof. Smith", role: "Faculty" },
];

const ManageUsers = () => {
  const [user, setUser] = useState(null);

  // Load user info for Topbar
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#e0f7fa' }}>
      <Sidebar role="admin"/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {user && <Topbar user={user} />}

        <Box sx={{ mt: 4, background: '#f3f4f6', p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>👥 Manage Users</Typography>

          <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#f9fbe7' }}>
            <List>
              {dummyUsers.map((user, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton edge="end" color="primary" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={user.name} secondary={user.role} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUsers;
