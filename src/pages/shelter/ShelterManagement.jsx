/**
 * Shelter Management Page
 * Manages shelter capacity and resources
 */
import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { getShelters } from '../../api/shelters.api';
import { getAnimals } from '../../api/animals.api';

/**
 * ShelterManagement Component
 * Displays shelter capacity and resource management
 */
const ShelterManagement = () => {
  const [shelters, setShelters] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sheltersRes, animalsRes] = await Promise.all([
          getShelters(),
          getAnimals(),
        ]);

        setShelters(sheltersRes.data || []);
        setAnimals(animalsRes.data || []);
      } catch (error) {
        console.error('Error fetching shelter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        Shelter Management
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Monitor shelter capacity and resources
      </Typography>

      <Grid container spacing={3}>
        {shelters.map((shelter) => {
          const occupancyRate = (shelter.currentOccupancy / shelter.capacity) * 100;
          const availableSpace = shelter.capacity - shelter.currentOccupancy;

          return (
            <Grid item xs={12} key={shelter.id}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {shelter.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {shelter.location}
                </Typography>

                {/* Capacity */}
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Capacity: {shelter.currentOccupancy} / {shelter.capacity}
                    </Typography>
                    <Typography variant="body2">
                      {occupancyRate.toFixed(1)}% Occupied
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={occupancyRate}
                    color={occupancyRate > 80 ? 'error' : occupancyRate > 60 ? 'warning' : 'success'}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Available Space: {availableSpace} animals
                  </Typography>
                </Box>

                {/* Feeding Schedule */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Feeding Schedule
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Meal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shelter.feedingSchedule.map((schedule, index) => (
                        <TableRow key={index}>
                          <TableCell>{schedule.time}</TableCell>
                          <TableCell>{schedule.meal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Resources */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Resources
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                      <Typography variant="h4" color="primary.contrastText">
                        {shelter.resources.food}
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Food (kg)
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light' }}>
                      <Typography variant="h4" color="secondary.contrastText">
                        {shelter.resources.medicine}
                      </Typography>
                      <Typography variant="body2" color="secondary.contrastText">
                        Medicine (units)
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                      <Typography variant="h4" color="success.contrastText">
                        {shelter.resources.bedding}
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Bedding (units)
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ShelterManagement;

