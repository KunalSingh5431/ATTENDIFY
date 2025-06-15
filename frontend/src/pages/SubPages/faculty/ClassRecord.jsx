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
  CircularProgress,
  TextField,
} from '@mui/material';

const semesterList = ['1', '2', '3', '4', '5', '6', '7', '8'];

const ClassRecord = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchData = async (semester, date) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/attendance/get-all');
      const data = await response.json();

      const filtered = data.filter(record => {
        const recordDate = new Date(record.timestamp).toLocaleDateString('en-CA');
        return record.semester === semester && (!date || recordDate === date);
      });

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
          };
        }

        if (record.status === 'Present') {
          grouped[key].present += 1;
        }
      });

      setAttendanceRecords(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      fetchData(selectedSemester, selectedDate);
    }
  }, [selectedSemester, selectedDate]);

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
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              width: '100%',
              maxWidth: 1050,
              backgroundColor: '#ffffffdd',
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#388e3c' }}
            >
              📊 Semester Attendance Record
            </Typography>

            {/* Semester and Date filters */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt:4,
                mb: 4,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <FormControl sx={{ minWidth: 300 }}>
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

              <TextField
                type="date"
                label="Select Date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{
                  minWidth: 300,
                  backgroundColor: '#f1f8e9',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#dcedc8' },
                }}
              />
            </Box>

            {/* Loader or Table */}
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
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>📅 Date</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>📕 Subject</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>✅ Present</TableCell>
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
                        <TableCell align="center">{record.date}</TableCell>
                        <TableCell align="center">{record.subjectName}</TableCell>
                        <TableCell align="center">{record.present}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
                  No attendance data found for semester {selectedSemester}
                  {selectedDate && ` on ${selectedDate}`}.
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

