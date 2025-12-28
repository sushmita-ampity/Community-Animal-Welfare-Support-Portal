/**
 * Make Donation Page
 * Form to make monetary or in-kind donations
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { createDonation } from '../../api/donations.api';

/**
 * MakeDonation Component
 * Allows users to make donations
 */
const MakeDonation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Monetary',
    amount: '',
    description: '',
    purpose: 'General',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

    // Validation
    if (formData.type === 'Monetary' && (!formData.amount || formData.amount <= 0)) {
      setError('Please enter a valid donation amount');
      return;
    }

    if (formData.type === 'In-Kind' && !formData.description) {
      setError('Please describe your in-kind donation');
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        userId: user.id,
        type: formData.type,
        amount: formData.type === 'Monetary' ? parseFloat(formData.amount) : 0,
        description: formData.type === 'In-Kind' ? formData.description : `Monetary donation of ₹${formData.amount}`,
        purpose: formData.purpose,
      };

      const response = await createDonation(donationData);

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/donations');
        }, 2000);
      } else {
        setError('Failed to process donation. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Make a Donation
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Support animal welfare with your contribution
      </Typography>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your donation! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Donation Type</FormLabel>
            <RadioGroup
              row
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <FormControlLabel value="Monetary" control={<Radio />} label="Monetary" />
              <FormControlLabel value="In-Kind" control={<Radio />} label="In-Kind" />
            </RadioGroup>
          </FormControl>

          {formData.type === 'Monetary' ? (
            <TextField
              fullWidth
              required
              label="Amount (₹)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              sx={{ mb: 3 }}
              inputProps={{ min: 1 }}
            />
          ) : (
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Donation Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you're donating (e.g., Dog food - 50kg bags, Blankets, etc.)"
              sx={{ mb: 3 }}
            />
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Purpose</InputLabel>
            <Select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              label="Purpose"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Medical">Medical</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Shelter">Shelter</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/donations')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Donation'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MakeDonation;

