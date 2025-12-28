/**
 * Vaccination Schedule Page
 * Displays vaccination schedules and reminders
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
import { getAnimals } from '../../api/animals.api';

/**
 * VaccinationSchedule Component
 * Shows vaccination schedules for animals
 */
const VaccinationSchedule = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await getAnimals();
        const animals = response.data || [];
        
        // Simulate vaccination schedule from health records
        const vaccinationList = animals
          .filter(animal => animal.healthRecords && animal.healthRecords.length > 0)
          .flatMap(animal =>
            animal.healthRecords
              .filter(record => record.type === 'Vaccination')
              .map(record => ({
                animalName: animal.name,
                animalType: animal.type,
                vaccine: record.description,
                date: record.date,
                veterinarian: record.veterinarian,
                nextDue: new Date(new Date(record.date).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              }))
          );

        setVaccinations(vaccinationList);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccinations();
  }, []);

  const isDue = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    return dueDate <= today;
  };

  const isUpcoming = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return dueDate > today && dueDate <= nextMonth;
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
        Vaccination Schedule
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Track vaccination schedules and upcoming due dates
      </Typography>

      {vaccinations.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 4 }}>
          No vaccination records found
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Animal</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Vaccine</TableCell>
                <TableCell>Last Vaccination</TableCell>
                <TableCell>Next Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vaccinations.map((vaccination, index) => (
                <TableRow key={index}>
                  <TableCell>{vaccination.animalName}</TableCell>
                  <TableCell>{vaccination.animalType}</TableCell>
                  <TableCell>{vaccination.vaccine}</TableCell>
                  <TableCell>
                    {new Date(vaccination.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(vaccination.nextDue).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isDue(vaccination.nextDue) ? (
                      <Chip label="Due" color="error" size="small" />
                    ) : isUpcoming(vaccination.nextDue) ? (
                      <Chip label="Upcoming" color="warning" size="small" />
                    ) : (
                      <Chip label="Current" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default VaccinationSchedule;

