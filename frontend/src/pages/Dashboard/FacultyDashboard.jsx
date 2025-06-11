import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Routes/Sidebar';
import Topbar from '../../components/Routes/Topbar';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import * as XLSX from 'xlsx';

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const sampleData = [
      {
        id: 1,
        className: 'Class A',
        subjectName: 'Math',
        studentName: 'John Doe',
        date: '2025-06-06',
        timestamp: '2025-06-06T09:00:00',
        status: 'Present',
      },
      {
        id: 2,
        className: 'Class A',
        subjectName: 'Math',
        studentName: 'Jane Smith',
        date: '2025-06-06',
        timestamp: '2025-06-06T09:05:00',
        status: 'Absent',
      },
      {
        id: 3,
        className: 'Class B',
        subjectName: 'Science',
        studentName: 'Alice',
        date: '2025-06-05',
        timestamp: '2025-06-05T10:00:00',
        status: 'Present',
      },
    ];
    setAttendanceRecords(sampleData);
    setFilteredRecords(sampleData);
  }, []);

  const applyFilters = () => {
    let filtered = attendanceRecords;

    if (filterClass) {
      filtered = filtered.filter((record) =>
        record.className.toLowerCase().includes(filterClass.toLowerCase())
      );
    }

    if (filterSubject) {
      filtered = filtered.filter((record) =>
        record.subjectName.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((record) => record.date === filterDate);
    }

    if (filterStartTime && filterEndTime) {
      filtered = filtered.filter((record) => {
        const recordTime = new Date(record.timestamp).getTime();
        const startTime = new Date(`${record.date}T${filterStartTime}`).getTime();
        const endTime = new Date(`${record.date}T${filterEndTime}`).getTime();
        return recordTime >= startTime && recordTime <= endTime;
      });
    }

    setFilteredRecords(filtered);
  };

  const exportToExcel = () => {
    const dataToExport = filteredRecords.map((record) => ({
      ID: record.id,
      'Student Name': record.studentName,
      Class: record.className,
      Subject: record.subjectName,
      Date: record.date,
      Time: new Date(record.timestamp).toLocaleTimeString(),
      Status: record.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

    XLSX.writeFile(workbook, 'AttendanceRecords.xlsx');
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="faculty" />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f9fafc', minHeight: '100vh' }}>
        <Topbar user={user} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                🎓 Class Attendance Records
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Filters */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Class Name"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} md={1.5}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    InputLabelProps={{ shrink: true }}
                    value={filterStartTime}
                    onChange={(e) => setFilterStartTime(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} md={1.5}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    InputLabelProps={{ shrink: true }}
                    value={filterEndTime}
                    onChange={(e) => setFilterEndTime(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    sx={{ mt: { xs: 1, md: 0 }, mr: 2 }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={exportToExcel}
                    sx={{ mt: { xs: 1, md: 0 } }}
                  >
                    Export to Excel
                  </Button>
                </Grid>
              </Grid>

              {/* Attendance Table */}
              <Paper elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.studentName}</TableCell>
                        <TableCell>{record.className}</TableCell>
                        <TableCell>{record.subjectName}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              record.status === 'Present'
                                ? 'success.main'
                                : 'error.main',
                            fontWeight: 'bold',
                          }}
                        >
                          {record.status}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default FacultyDashboard;
