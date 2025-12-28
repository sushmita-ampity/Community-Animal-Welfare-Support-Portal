/**
 * Success Stories Page
 * Displays community success stories
 */
import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { getStories } from '../../api/stories.api';

/**
 * SuccessStories Component
 * Lists all success stories
 */
const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await getStories();
        setStories(response.data || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

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
        Success Stories
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Inspiring stories of rescued animals finding their forever homes
      </Typography>

      {stories.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 4 }}>
          No success stories available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} md={6} key={story.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="250"
                  image={story.image || '/api/placeholder/600/400'}
                  alt={story.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {story.description}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {story.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {story.author} • {new Date(story.date).toLocaleDateString()}
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

export default SuccessStories;

