import React, { useState } from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Table, TableHead, TableBody, TableRow, TableCell, Paper
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

const ClassRecordAdmin = () => {
  const [selectedClass, setSelectedClass] = useState('');

  return (
    <Box sx={{ background: '#e8f5e9', p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>📚 Class Record</Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Class</InputLabel>
        <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} label="Select Class">
          {Object.keys(classAttendance).map((cls) => (
            <MenuItem key={cls} value={cls}>{cls}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedClass && (
        <Paper sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#c8e6c9' }}>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Present</strong></TableCell>
                <TableCell><strong>Absent</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classAttendance[selectedClass].map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.present}</TableCell>
                  <TableCell>{record.absent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ClassRecordAdmin;
