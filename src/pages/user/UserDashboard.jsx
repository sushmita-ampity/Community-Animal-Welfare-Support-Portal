/**
 * User Dashboard
 * Main dashboard for regular users
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';
import { getAnimals } from '../../api/animals.api';
import { getAdoptions } from '../../api/adoptions.api';
import { getDonations } from '../../api/donations.api';

/**
 * UserDashboard Component
 * Displays user-specific statistics and quick actions
 */
const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reportedAnimals: 0,
    adoptionRequests: 0,
    donations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [animalsRes, adoptionsRes, donationsRes] = await Promise.all([
          getAnimals({ reportedBy: user.id }),
          getAdoptions({ userId: user.id }),
          getDonations({ userId: user.id }),
        ]);

        setStats({
          reportedAnimals: animalsRes.data?.length || 0,
          adoptionRequests: adoptionsRes.data?.length || 0,
          donations: donationsRes.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const quickActions = [
    {
      title: 'Report Animal',
      description: 'Report an animal in distress',
      icon: <PetsIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      action: () => navigate('/animals/report'),
    },
    {
      title: 'View Animals',
      description: 'Browse available animals',
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      color: '#dc004e',
      action: () => navigate('/animals'),
    },
    {
      title: 'Make Donation',
      description: 'Support animal welfare',
      icon: <VolunteerActivismIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      action: () => navigate('/donations/make'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Your Animal Welfare Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {stats.reportedAnimals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Animals Reported
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary">
              {stats.adoptionRequests}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adoption Requests
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">
              {stats.donations}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Donations Made
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: action.color, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={action.action}
                >
                  {action.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDashboard;

