/**
 * Admin Dashboard
 * Main dashboard for administrators with analytics
 */
import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { getAnimals } from '../../api/animals.api';
import { getAdoptions } from '../../api/adoptions.api';
import { getDonationStats } from '../../api/donations.api';
import { getVolunteers } from '../../api/volunteers.api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * AdminDashboard Component
 * Displays comprehensive analytics and statistics
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalAdoptions: 0,
    totalDonations: 0,
    totalVolunteers: 0,
    adoptionStats: {},
    donationStats: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [animalsRes, adoptionsRes, donationsRes, volunteersRes] = await Promise.all([
          getAnimals(),
          getAdoptions(),
          getDonationStats(),
          getVolunteers(),
        ]);

        // Calculate adoption statistics
        const adoptions = adoptionsRes.data || [];
        const adoptionStats = {
          approved: adoptions.filter(a => a.status === 'Approved').length,
          pending: adoptions.filter(a => a.status === 'Pending').length,
          rejected: adoptions.filter(a => a.status === 'Rejected').length,
        };

        setStats({
          totalAnimals: animalsRes.data?.length || 0,
          totalAdoptions: adoptions.length,
          totalDonations: donationsRes.data?.totalCount || 0,
          totalVolunteers: volunteersRes.data?.length || 0,
          adoptionStats,
          donationStats: donationsRes.data || {},
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Adoption Status Chart Data
  const adoptionChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Adoption Requests',
        data: [
          stats.adoptionStats.approved,
          stats.adoptionStats.pending,
          stats.adoptionStats.rejected,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  // Donation Chart Data
  const donationChartData = {
    labels: stats.donationStats.monthlyStats
      ? Object.keys(stats.donationStats.monthlyStats)
      : [],
    datasets: [
      {
        label: 'Monthly Donations (₹)',
        data: stats.donationStats.monthlyStats
          ? Object.values(stats.donationStats.monthlyStats).map(m => m.monetary)
          : [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Welcome, {user?.name}! Overview of the Animal Welfare Portal.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {stats.totalAnimals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Animals
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary">
              {stats.totalAdoptions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adoption Requests
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">
              ₹{stats.donationStats.totalMonetary?.toLocaleString() || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Donations
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main">
              {stats.totalVolunteers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Volunteers
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Adoption Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut data={adoptionChartData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Donations Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              {donationChartData.labels.length > 0 ? (
                <Bar data={donationChartData} />
              ) : (
                <Typography>No donation data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

