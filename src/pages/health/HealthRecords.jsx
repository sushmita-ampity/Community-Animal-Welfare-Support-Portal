/**
 * Health Records Page
 * Displays animal health records
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
  CircularProgress,
} from '@mui/material';
import { getAnimals } from '../../api/animals.api';

/**
 * HealthRecords Component
 * Lists all animal health records
 */
const HealthRecords = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await getAnimals();
        const animalsWithRecords = (response.data || []).filter(
          animal => animal.healthRecords && animal.healthRecords.length > 0
        );
        setAnimals(animalsWithRecords);
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
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
        Animal Health Records
      </Typography>

      {animals.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 4 }}>
          No health records found
        </Typography>
      ) : (
        animals.map((animal) => (
          <Paper key={animal.id} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {animal.name} ({animal.type})
            </Typography>
            <TableContainer>
              <Table size="small">
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
        ))
      )}
    </Box>
  );
};

export default HealthRecords;

