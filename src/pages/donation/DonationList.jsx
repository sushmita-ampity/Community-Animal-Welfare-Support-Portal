/**
 * Donation List Page
 * Lists all donations
 */
import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getDonations } from '../../api/donations.api';

/**
 * DonationList Component
 * Displays donation history
 */
const DonationList = () => {
  const { user, isAdmin } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const filters = isAdmin ? {} : { userId: user.id };
        const response = await getDonations(filters);
        setDonations(response.data || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user, isAdmin]);

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
        {isAdmin ? 'All Donations' : 'My Donations'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount/Description</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No donations found
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {new Date(donation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={donation.type}
                      size="small"
                      color={donation.type === 'Monetary' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    {donation.type === 'Monetary'
                      ? `₹${donation.amount.toLocaleString()}`
                      : donation.description}
                  </TableCell>
                  <TableCell>{donation.purpose}</TableCell>
                  <TableCell>
                    <Chip label={donation.status} color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DonationList;

