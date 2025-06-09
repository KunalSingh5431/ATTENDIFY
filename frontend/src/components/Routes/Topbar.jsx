import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  Chip
} from '@mui/material';

const Topbar = ({user}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    handleCloseMenu();
    navigate('/profile');
  };
  
  const handleLogout = () => {
    handleCloseMenu();
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        paddingX: 2,
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>👋 Welcome {user.fullname}</Typography>
        <Chip
          label={user.role.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: '#e2e8f0',
            color: '#1e293b',
            fontWeight: 500,
            marginRight: 2,
          }}
        />

        <Tooltip title="View Profile">
          <IconButton onClick={handleOpenMenu}>
            <Avatar
              alt={user.name}
              src={user.profileImage}
              sx={{
                width: 40,
                height: 40,
                border: '2px solid #cbd5e1',
              }}
            />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 160,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: 2,
              '& .MuiMenuItem-root': {
                fontSize: 14,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
