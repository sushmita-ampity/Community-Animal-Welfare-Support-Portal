/**
 * Submit Adoption Page
 * Form to submit adoption/foster request
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getAnimalById } from '../../api/animals.api';
import { submitAdoptionRequest } from '../../api/adoptions.api';

/**
 * SubmitAdoption Component
 * Allows users to submit adoption or foster requests
 */
const SubmitAdoption = () => {
  const { animalId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Adoption',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await getAnimalById(animalId);
        if (response.data) {
          setAnimal(response.data);
        } else {
          setError('Animal not found');
        }
      } catch (error) {
        setError('Error loading animal');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [animalId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await submitAdoptionRequest({
        animalId: parseInt(animalId),
        userId: user.id,
        type: formData.type,
        notes: formData.notes,
      });

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/adoptions');
        }, 2000);
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
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

  return (
    <Box>
      <Button onClick={() => navigate(`/animals/${animalId}`)} sx={{ mb: 2 }}>
        ← Back to Animal
      </Button>

      <Typography variant="h4" gutterBottom>
        Submit Adoption Request
      </Typography>

      {animal && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">{animal.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {animal.type} • {animal.breed} • Age: {animal.age} years
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Request submitted successfully! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Request Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Request Type"
            >
              <MenuItem value="Adoption">Adoption</MenuItem>
              <MenuItem value="Foster">Foster</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us why you'd like to adopt/foster this animal..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/animals/${animalId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubmitAdoption;

