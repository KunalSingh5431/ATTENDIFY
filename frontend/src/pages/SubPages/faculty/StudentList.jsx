import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Routes/Sidebar';
import Topbar from '../../../components/Routes/Topbar';

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

const studentData = {
  "Class A": ["Alice Johnson", "Bob Smith", "Charlie Brown"],
  "Class B": ["David Miller", "Eve Davis", "Frank Wilson"]
};

const StudentList = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="faculty" />
      <Box sx={{ flexGrow: 1 }}>
        {user && <Topbar user={user} />}
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #e0f7fa, #f1f8e9)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 600, backgroundColor: '#ffffffcc' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              📋 Student List
            </Typography>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="class-select-label">Select Class</InputLabel>
              <Select
                labelId="class-select-label"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e3f2fd' },
                }}
              >
                {Object.keys(studentData).map((cls) => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedClass && (
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 6,
                  backgroundColor: '#e3f2fd',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.01)',
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                    👨‍🎓 Students in {selectedClass}
                  </Typography>
                  <List>
                    {studentData[selectedClass].map((student, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          transition: '0.3s',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                            transform: 'scale(1.02)',
                            borderRadius: 1,
                          }
                        }}
                      >
                        <ListItemText primary={student} primaryTypographyProps={{ fontWeight: 500 }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentList;
