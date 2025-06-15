import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Box
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
/*import NotificationsIcon from '@mui/icons-material/Notifications';*/
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setCollapsed(!collapsed);
  };

  const drawerWidth = collapsed ? 70 : 250;
  const dashboardPath =
    role === 'admin'
      ? '/admin-dashboard'
      : role === 'faculty'
      ? '/faculty-dashboard'
      : '/student-dashboard';

  const commonItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: dashboardPath },
    //{ text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' }
  ];

  const adminItems = [
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/manage-user' },
    { text: 'Class Record', icon: <SchoolIcon />, path: '/class-record-admin' },
    { text: 'Analytics', icon: <DashboardIcon />, path: '/analytics' }
  ];

  const facultyItems = [
    { text: 'Class Records', icon: <SchoolIcon />, path: '/class-record' },
    { text: 'Attendance Files', icon: <InsertDriveFileIcon />, path: '/attendence-file' },
    //{ text: 'Student List', icon: <PeopleIcon />, path: '/student-list' }
  ];

  const studentItems = [
    { text: 'View Attendance', icon: <SchoolIcon />, path: '/view-attendance' }
  ];

  const getRoleItems = () => {
    switch (role) {
      case 'admin':
        return adminItems;
      case 'faculty':
        return facultyItems;
      case 'student':
        return studentItems;
      default:
        return [];
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxShadow: '2px 0px 10px rgba(0,0,0,0.1)',
          backgroundColor: '#1e293b',
          color: '#fff'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          alignItems: 'center',
          padding: '8px'
        }}
      >
        <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: '#334155' }} />

      <List>
        {[...commonItems, ...getRoleItems()].map((item, index) => (
          <Tooltip title={collapsed ? item.text : ''} key={index} placement="right">
            <ListItem
              button
              onClick={() => navigate(item.path)}
              sx={{
                paddingY: '10px',
                paddingX: collapsed ? '12px' : '24px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#334155'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
