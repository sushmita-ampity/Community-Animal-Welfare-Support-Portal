/**
 * Navigation Menu Component
 * Role-based navigation menu
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';

/**
 * NavMenu Component
 * Provides navigation menu based on user role
 */
const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isVolunteer } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/animals', label: 'Animals', icon: <PetsIcon /> },
    { path: '/adoptions', label: 'Adoptions', icon: <FavoriteIcon /> },
    { path: '/donations', label: 'Donations', icon: <VolunteerActivismIcon /> },
    { path: '/health/records', label: 'Health Records', icon: <HealthAndSafetyIcon /> },
    { path: '/campaigns', label: 'Campaigns', icon: <CampaignIcon /> },
    { path: '/events', label: 'Events', icon: <EventIcon /> },
    { path: '/stories', label: 'Success Stories', icon: <BookIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  // Add role-specific items
  if (isAdmin || isVolunteer) {
    menuItems.splice(5, 0, { path: '/shelters', label: 'Shelters', icon: <HomeIcon /> });
  }

  if (isAdmin) {
    menuItems.splice(1, 0, { path: '/admin/dashboard', label: 'Admin Panel', icon: <DashboardIcon /> });
  }

  if (isVolunteer) {
    menuItems.splice(1, 0, { path: '/volunteer/dashboard', label: 'Volunteer Panel', icon: <DashboardIcon /> });
  }

  if (user?.role === 'USER') {
    menuItems.splice(1, 0, { path: '/user/dashboard', label: 'My Dashboard', icon: <DashboardIcon /> });
  }

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavMenu;

