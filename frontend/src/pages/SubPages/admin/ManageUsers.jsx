import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const users = [
  { name: "Alice", role: "Student" },
  { name: "Bob", role: "Student" },
  { name: "Prof. Smith", role: "Faculty" },
];

const ManageUsers = () => {
  return (
    <Box sx={{ background: '#f3f4f6', p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>👥 Manage Users</Typography>
      <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#f9fbe7' }}>
        <List>
          {users.map((user, index) => (
            <ListItem key={index} secondaryAction={
              <>
                <IconButton edge="end" color="primary"><EditIcon /></IconButton>
                <IconButton edge="end" color="error"><DeleteIcon /></IconButton>
              </>
            }>
              <ListItemText primary={user.name} secondary={user.role} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ManageUsers;
