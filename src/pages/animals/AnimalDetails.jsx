/**
 * Animal Details Page
 * Detailed view of a single animal
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../../context/AuthContext';
import { getAnimalById, updateAnimal } from '../../api/animals.api';
import { getAdoptions } from '../../api/adoptions.api';

/**
 * AnimalDetails Component
 * Shows detailed information about an animal
 */
const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isVolunteer } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [adoptionRequest, setAdoptionRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animalRes = await getAnimalById(id);
        if (animalRes.data) {
          setAnimal(animalRes.data);

          // Check if user has adoption request for this animal
          const adoptionsRes = await getAdoptions({
            userId: user.id,
            animalId: id,
          });
          if (adoptionsRes.data && adoptionsRes.data.length > 0) {
            setAdoptionRequest(adoptionsRes.data[0]);
          }
        } else {
          setError('Animal not found');
        }
      } catch (error) {
        setError('Error loading animal details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await updateAnimal(id, { status: newStatus });
      if (response.data) {
        setAnimal(response.data);
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !animal) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!animal) return null;

  return (
    <Box>
      <Button onClick={() => navigate('/animals')} sx={{ mb: 2 }}>
        ← Back to Animals
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <img
              src={animal.image || '/api/placeholder/600/400'}
              alt={animal.name}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {animal.name}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={animal.status} color="primary" sx={{ mr: 1 }} />
              <Chip label={animal.type} sx={{ mr: 1 }} />
              <Chip label={animal.condition} />
            </Box>

            <Typography variant="body1" paragraph>
              <strong>Breed:</strong> {animal.breed}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Age:</strong> {animal.age} years
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Condition:</strong> {animal.condition} ({animal.severity} severity)
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {animal.description}
            </Typography>

            {animal.location && (
              <Box sx={{ mt: 2 }}>
                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                <Typography variant="body2" display="inline">
                  {animal.location.address}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Coordinates: {animal.location.latitude}, {animal.location.longitude}
                </Typography>
              </Box>
            )}

            {animal.status === 'Available for Adoption' && !adoptionRequest && (
              <Button
                variant="contained"
                startIcon={<FavoriteIcon />}
                onClick={() => navigate(`/adoptions/submit/${id}`)}
                sx={{ mt: 2 }}
              >
                Request Adoption
              </Button>
            )}

            {adoptionRequest && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You have a {adoptionRequest.status} adoption request for this animal.
              </Alert>
            )}

            {/* Admin/Volunteer Actions */}
            {(isAdmin || isVolunteer) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Admin Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStatusUpdate('Under Treatment')}
                  >
                    Mark Under Treatment
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStatusUpdate('Available for Adoption')}
                  >
                    Mark Available
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Health Records */}
        {animal.healthRecords && animal.healthRecords.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Health Records
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Veterinarian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {animal.healthRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.veterinarian}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AnimalDetails;

