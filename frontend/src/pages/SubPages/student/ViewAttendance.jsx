import React, { useState } from 'react';
import {
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
  Paper
} from '@mui/material';

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, date: '2025-05-01', status: 'Present', time: '10:01 AM' },
    { id: 2, date: '2025-05-02', status: 'Absent', time: '-' },
    { id: 3, date: '2025-05-03', status: 'Present', time: '10:00 AM' },
    { id: 4, date: '2025-05-04', status: 'Present', time: '10:03 AM' },
    { id: 5, date: '2025-05-05', status: 'Absent', time: '-' },
  ]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📅 Attendance Records
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time In</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white'
                      }}
                    >
                      <TableCell>{row.date}</TableCell>
                      <TableCell
                        sx={{
                          color: row.status === 'Present' ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}
                      >
                        {row.status}
                      </TableCell>
                      <TableCell>{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewAttendance;
