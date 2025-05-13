import React, { useState } from 'react';
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
  TableContainer
} from '@mui/material';

const classAttendance = {
  "Class A": [
    { date: "2025-05-01", present: 25, absent: 5 },
    { date: "2025-05-02", present: 24, absent: 6 }
  ],
  "Class B": [
    { date: "2025-05-01", present: 28, absent: 2 },
    { date: "2025-05-02", present: 27, absent: 3 }
  ]
};

const ClassRecord = () => {
  const [selectedClass, setSelectedClass] = useState('');

  return (
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
          📊 Class Attendance Record
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
              backgroundColor: '#f1f8e9',
              '&:hover': { backgroundColor: '#dcedc8' },
            }}
          >
            {Object.keys(classAttendance).map((cls) => (
              <MenuItem key={cls} value={cls}>{cls}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedClass && (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 6 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#c8e6c9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>📅 Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>✅ Present</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>❌ Absent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classAttendance[selectedClass].map((record, index) => (
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
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.absent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ClassRecord;
