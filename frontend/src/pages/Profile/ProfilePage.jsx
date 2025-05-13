import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  Person,
  Email,
  Badge
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateProfileImage = async () => {
    if (!profileImage) return alert('Please upload an image first.');
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/auth/profile-image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage })
      });
  
      const contentType = res.headers.get('content-type');
  
      if (!res.ok) {
        let errorMessage = 'Failed to update profile image';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await res.text(); // HTML or raw text
          console.error('HTML error response:', errorText);
          errorMessage = 'Unexpected HTML response from server';
        }
        return toast.error(errorMessage);
      }
  
      const data = await res.json();
      toast.success('Profile image updated successfully');
  
      const updatedUser = { ...user, profileImage, avatar: profileImage };
      setUser(updatedUser);
      setProfileImage(profileImage);
      localStorage.setItem('user', JSON.stringify(updatedUser));
  
    } catch (err) {
      console.error('Image update error:', err);
      toast.error('Server error while updating profile image');
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch('http://localhost:8000/api/upload-avatar', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
    return data.url;
  };
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const imageUrl = await uploadImageToCloudinary(file);
  
    setProfileImage(imageUrl);
    
    const updatedUser = { ...user, profileImage: imageUrl,avatar: imageUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const handleBackToDashboard = () => {
    navigate(-1);
  };

  if (!user) {
    return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      );
  }

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
        p: 2
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 700,
          borderRadius: 3,
          boxShadow: 5,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 3,
            textAlign: 'center',
            background: 'linear-gradient(to right, #3b82f6, #6366f1)'
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Profile Information
          </Typography>
          <Typography variant="body2" mt={1}>
            View and update your profile
          </Typography>
        </Box>

        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Avatar
              src={profileImage || user.profileImage || '/default-profile.png'}
              sx={{
                width: 100,
                height: 100,
                border: '3px solid #3b82f6',
                mb: 1
              }}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <Button
                variant="outlined"
                size="small"
                component="span"
                startIcon={<UploadIcon />}
                sx={{
                  color: '#3b82f6',
                  borderColor: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    color: '#2563eb'
                  }
                }}
              >
                Add Photo
              </Button>
            </label>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={user?.fullname || 'N/A'}
                variant="outlined"
                disabled
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Number"
                value={user?.idno || 'N/A'}
                variant="outlined"
                disabled
                InputProps={{
                  startAdornment: <Badge sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={user?.email || 'N/A'}
                variant="outlined"
                disabled
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1 }} />
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
              variant="contained"
              size="large"
              onClick={updateProfileImage}
              sx={{
                px: 4,
                background: 'linear-gradient(to right, #3b82f6, #6366f1)',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>

          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{
                px: 3,
                color: '#3b82f6',
                borderColor: '#3b82f6',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#2563eb',
                  color: '#2563eb'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    <ToastContainer />
    </>
  );
};

export default ProfilePage;
