/**
 * Campaigns Page
 * Displays awareness campaigns
 */
import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { getCampaigns } from '../../api/campaigns.api';

/**
 * Campaigns Component
 * Lists all awareness campaigns
 */
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Upcoming':
        return 'info';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Awareness Campaigns
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Join our campaigns to spread awareness about animal welfare
      </Typography>

      {campaigns.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 4 }}>
          No campaigns available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} md={6} key={campaign.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={campaign.image || '/api/placeholder/800/400'}
                  alt={campaign.title}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6">
                      {campaign.title}
                    </Typography>
                    <Chip
                      label={campaign.status}
                      color={getStatusColor(campaign.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {campaign.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Campaigns;

