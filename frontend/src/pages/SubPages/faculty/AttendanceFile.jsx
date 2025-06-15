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
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const AttendanceFile = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const userObj = JSON.parse(storedUser);
    setUser(userObj);

    const role = userObj.role || '';
    const facultyId = role === 'faculty' ? userObj._id : '';

    const url = facultyId
      ? `http://localhost:8000/api/attendance-files?facultyId=${facultyId}`
      : `http://localhost:8000/api/attendance-files/get-attendance`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          console.error('Invalid file list:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
        setLoading(false);
      });
  }, []);

  const confirmDelete = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete || !fileToDelete._id) {
      alert('Invalid file ID');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/attendance-files/delete-file/${fileToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles((prev) => prev.filter(f => f._id !== fileToDelete._id));
        setDeleteDialogOpen(false);
        setFileToDelete(null);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete file.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="faculty" />
      <Box sx={{ flexGrow: 1 }}>
        {user && <Topbar user={user} />}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📂 All Attendance Files
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table>
                      <TableHead sx={{ backgroundColor: '#1976d2' }}>
                      <TableRow>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Date</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Time</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Attendance File</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Download</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                      <TableBody>
                        {files.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No attendance files found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          files.map((file, index) => {
                            const rawDate = file.uploadedAt || file.timestamp || Date.now();
                            const fileDate = new Date(rawDate);
                            const fileName =
                              file.name || (file.public_id?.split('/').pop() ?? 'Unnamed File');

                            return (
                              <TableRow
                                key={index}
                                sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}
                              >
                                <TableCell align="center" sx={{ textAlign: 'center' }}>
                                  {fileDate.toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </TableCell>
                                <TableCell align="center" sx={{ textAlign: 'center' }}>
                                  {fileDate.toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </TableCell>
                                <TableCell align="center" sx={{ textAlign: 'center' }}>{fileName}</TableCell>
                                <TableCell align="center" sx={{ textAlign: 'center' }}>
                                  <Tooltip title="Download">
                                    <IconButton
                                      color="secondary"
                                      href={file.url}
                                      download={fileName}
                                    >
                                      <DownloadIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ textAlign: 'center' }}>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      color="error"
                                      onClick={() => confirmDelete(file)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })
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

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the file{' '}
            <strong>{fileToDelete?.name || fileToDelete?.public_id || 'this file'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceFile;
