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
  Modal,
} from '@mui/material';
import * as XLSX from 'xlsx';

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [filterSem, setFilterSem] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalStudents, setTotalStudents] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/attendance/get-all');
        const data = await response.json();
        setAttendanceRecords(data);
        setFilteredRecords(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = attendanceRecords;

    if (filterSem) {
      filtered = filtered.filter((record) =>
        record.semester.toLowerCase().includes(filterSem.toLowerCase())
      );
    }

    if (filterSubject) {
      filtered = filtered.filter((record) =>
        record.subjectName.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.timestamp).toLocaleDateString('en-CA');
        return recordDate === filterDate;
      });
    }

    if (filterDate && filterStartTime && filterEndTime) {
      filtered = filtered.filter((record) => {
        const recordTime = new Date(record.timestamp).getTime();
        const startTime = new Date(`${filterDate}T${filterStartTime}`).getTime();
        const endTime = new Date(`${filterDate}T${filterEndTime}`).getTime();
        return recordTime >= startTime && recordTime <= endTime;
      });
    }

    setFilteredRecords(filtered);
  };

  const exportToExcel = () => {
    const dataToExport = filteredRecords.map((record) => ({
      ID: record._id,
      StudentName: record.name,
      Semester: record.semester,
      Subject: record.subjectName,
      Date: new Date(record.timestamp).toLocaleDateString('en-CA'),
      Time: new Date(record.timestamp).toLocaleTimeString(),
      Status: record.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

    XLSX.writeFile(workbook, 'AttendanceRecords.xlsx');
  };

  const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
  const absentCount = totalStudents !== '' ? Math.max(parseInt(totalStudents) - presentCount, 0) : '-';

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
                    label="Semester"
                    value={filterSem}
                    onChange={(e) => setFilterSem(e.target.value)}
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
                <Grid item xs={12}>
                  <Button variant="contained" onClick={applyFilters} sx={{ mr: 2 }}>
                    Apply Filters
                  </Button>
                  <Button variant="outlined" color="success" onClick={exportToExcel}>
                    Export to Excel
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => setIsModalOpen(true)} sx={{ ml: 2 }}>
                    Find Absent
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3, display: 'flex', gap: 4 }}>
                <Typography variant="subtitle1" color="success.main" fontWeight="bold">
                  ✅ Present: {presentCount}
                </Typography>
                <Typography variant="subtitle1" color="error.main" fontWeight="bold">
                  ❌ Absent: {absentCount !== '-' ? absentCount : 'Enter total'}
                </Typography>
              </Box>

              <Paper elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{record._id}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.semester}</TableCell>
                        <TableCell>{record.subjectName}</TableCell>
                        <TableCell>
                          {new Date(record.timestamp).toLocaleDateString('en-CA')}
                        </TableCell>
                        <TableCell>
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: record.status === 'Present' ? 'success.main' : 'error.main',
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="absent-modal-title"
        aria-describedby="absent-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="absent-modal-title" variant="h6" fontWeight="bold" gutterBottom>
            Calculate Absent Students
          </Typography>

          <TextField
            fullWidth
            label="Total Number of Students"
            type="number"
            value={totalStudents}
            onChange={(e) => setTotalStudents(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography>
            ✅ Present: <strong>{presentCount}</strong>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            ❌ Absent: <strong>{absentCount}</strong>
          </Typography>

          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="contained" color="success">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FacultyDashboard;

