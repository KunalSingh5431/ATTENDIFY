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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  CircularProgress
} from '@mui/material';

const semesterList = ['1', '2', '3', '4', '5', '6', '7', '8'];

const ClassRecord = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchData = async (semester) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/attendance/get-all');
      const data = await response.json();

      const filtered = data.filter(record => record.semester === semester);

      const grouped = {};

      filtered.forEach(record => {
        const dateObj = new Date(record.timestamp);
        const dateKey = dateObj.toLocaleDateString('en-CA'); 
        const subject = record.subjectName || 'Unknown';
        const key = `${dateKey}_${subject}`;

        if (!grouped[key]) {
          grouped[key] = {
            date: dateKey,
            subjectName: subject,
            present: 0,
            absent: 0
          };
        }

        if (record.status === 'Present') {
          grouped[key].present += 1;
        } else if (record.status === 'Absent') {
          grouped[key].absent += 1;
        }
      });

      const summaryArray = Object.values(grouped);
      setAttendanceRecords(summaryArray);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      fetchData(selectedSemester);
    }
  }, [selectedSemester]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="faculty" />
      <Box sx={{ flexGrow: 1 }}>
        {user && <Topbar user={user} />}
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #e1f5fe, #e8f5e9)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 700, backgroundColor: '#ffffffdd' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#388e3c' }}>
              📊 Semester Attendance Record
            </Typography>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="semester-select-label">Select Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                label="Select Semester"
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#f1f8e9',
                  '&:hover': { backgroundColor: '#dcedc8' },
                }}
              >
                {semesterList.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
                <CircularProgress color="success" />
              </Box>
            ) : (
              selectedSemester &&
              (attendanceData.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 6 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#c8e6c9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>📅 Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>📕 Subject</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>✅ Present</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>❌ Absent</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>📌 Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.map((record, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f1f8e9',
                              transition: '0.3s',
                            },
                          }}
                        >
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.subjectName}</TableCell>
                          <TableCell>{record.present}</TableCell>
                          <TableCell>{record.absent}</TableCell>
                          <TableCell>{record.present + record.absent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
                  No attendance data found for semester {selectedSemester}.
                </Typography>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ClassRecord;
