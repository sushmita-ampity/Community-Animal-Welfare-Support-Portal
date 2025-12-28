/**
 * Adoption List Page
 * Lists all adoption requests
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getAdoptions } from '../../api/adoptions.api';
import { getAnimalById } from '../../api/animals.api';
import { updateAdoptionStatus } from '../../api/adoptions.api';

/**
 * AdoptionList Component
 * Displays adoption requests with admin approval actions
 */
const AdoptionList = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const filters = isAdmin ? {} : { userId: user.id };
        const response = await getAdoptions(filters);
        
        // Fetch animal details for each adoption
        const adoptionsWithAnimals = await Promise.all(
          (response.data || []).map(async (adoption) => {
            const animalRes = await getAnimalById(adoption.animalId);
            return {
              ...adoption,
              animal: animalRes.data,
            };
          })
        );
        
        setAdoptions(adoptionsWithAnimals);
      } catch (error) {
        setError('Error loading adoptions');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, [user, isAdmin]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await updateAdoptionStatus(id, status, user.id);
      if (response.data) {
        setAdoptions(adoptions.map(adopt =>
          adopt.id === id ? response.data : adopt
        ));
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
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
        {isAdmin ? 'All Adoption Requests' : 'My Adoption Requests'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Animal</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {adoptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                  No adoption requests found
                </TableCell>
              </TableRow>
            ) : (
              adoptions.map((adoption) => (
                <TableRow key={adoption.id}>
                  <TableCell>
                    {adoption.animal?.name || `Animal #${adoption.animalId}`}
                  </TableCell>
                  <TableCell>{adoption.type}</TableCell>
                  <TableCell>
                    {new Date(adoption.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={adoption.status}
                      color={getStatusColor(adoption.status)}
                      size="small"
                    />
                  </TableCell>
                  {isAdmin && adoption.status === 'Pending' && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleStatusUpdate(adoption.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleStatusUpdate(adoption.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                  {isAdmin && adoption.status !== 'Pending' && (
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => navigate(`/animals/${adoption.animalId}`)}
                      >
                        View Animal
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdoptionList;

