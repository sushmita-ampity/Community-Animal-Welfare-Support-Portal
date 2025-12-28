/**
 * Volunteer Dashboard
 * Dashboard for volunteers with assigned tasks
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../../context/AuthContext';
import { getVolunteerByUserId } from '../../api/volunteers.api';
import { getAnimals } from '../../api/animals.api';

/**
 * VolunteerDashboard Component
 * Displays volunteer tasks and assigned animals
 */
const VolunteerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [assignedAnimals, setAssignedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const volunteerRes = await getVolunteerByUserId(user.id);
        if (volunteerRes.data) {
          setVolunteer(volunteerRes.data);
          
          // Get assigned animals
          const animalsRes = await getAnimals();
          const assigned = animalsRes.data?.filter(
            animal => animal.assignedVolunteer === user.id
          ) || [];
          setAssignedAnimals(assigned);
        }
      } catch (error) {
        console.error('Error fetching volunteer data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Volunteer Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Welcome, {user?.name}! Manage your assigned tasks and animals.
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {volunteer?.assignedTasks?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned Tasks
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary">
              {volunteer?.totalHours || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Hours
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">
              {assignedAnimals.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned Animals
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Assigned Animals */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Assigned Animals
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignedAnimals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No animals assigned yet
                </TableCell>
              </TableRow>
            ) : (
              assignedAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.condition}</TableCell>
                  <TableCell>
                    <Chip label={animal.status} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/animals/${animal.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tasks */}
      {volunteer?.assignedTasks && volunteer.assignedTasks.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            My Tasks
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Animal</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {volunteer.assignedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>Animal #{task.animalId}</TableCell>
                    <TableCell>
                      {new Date(task.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default VolunteerDashboard;

