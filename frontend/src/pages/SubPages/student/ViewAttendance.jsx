import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/Routes/Sidebar';
import Topbar from '../../../components/Routes/Topbar';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';

const ViewAttendance = () => {
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const userObj = JSON.parse(storedUser);
    setUser(userObj);

    const userId = userObj.id || userObj._id; 

    fetch(`http://localhost:8000/api/attendance/student/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAttendanceData(data);
        } else {
          console.error('Invalid attendance response:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="student" />
      <Box sx={{ flexGrow: 1 }}>
        {user && <Topbar user={user} />}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📅 Attendance Records
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: '#1976d2' }}>
                          <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time In</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Faculty</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attendanceData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                No attendance records found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            attendanceData.map((row, index) => (
                              <TableRow
                                key={index}
                                sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}
                              >
                                <TableCell>{row.date || '-'}</TableCell>
                                <TableCell
                                  sx={{
                                    color: row.status === 'Present' ? 'green' : 'red',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {row.status || '-'}
                                </TableCell>
                                <TableCell>{row.time || '-'}</TableCell>
                                <TableCell>{row.subjectName || '-'}</TableCell>
                                <TableCell>{row.facultyName || '-'}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAttendance;
