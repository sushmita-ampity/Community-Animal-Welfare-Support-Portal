/**
 * Main Dashboard Page
 * Routes to role-specific dashboards
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Dashboard Component
 * Redirects to role-specific dashboard
 */
const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'VOLUNTEER':
          navigate('/volunteer/dashboard');
          break;
        case 'USER':
          navigate('/user/dashboard');
          break;
        default:
          navigate('/user/dashboard');
      }
    }
  }, [user, loading, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Dashboard;

