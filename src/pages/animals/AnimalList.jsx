/**
 * Animal List Page
 * Displays all animals with filtering options
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';
import { getAnimals } from '../../api/animals.api';

/**
 * AnimalList Component
 * Lists all animals with filtering and search
 */
const AnimalList = () => {
  const { user, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const filters = isAdmin || isVolunteer ? {} : { reportedBy: user.id };
        const response = await getAnimals(filters);
        setAnimals(response.data || []);
        setFilteredAnimals(response.data || []);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [user, isAdmin, isVolunteer]);

  useEffect(() => {
    let filtered = [...animals];

    if (filters.type) {
      filtered = filtered.filter(animal => animal.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(animal => animal.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.name?.toLowerCase().includes(searchLower) ||
        animal.breed?.toLowerCase().includes(searchLower) ||
        animal.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAnimals(filtered);
  }, [filters, animals]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available for Adoption':
        return 'success';
      case 'Under Treatment':
        return 'warning';
      case 'Reported':
        return 'info';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Animals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/animals/report')}
        >
          Report Animal
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            label="Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Dog">Dog</MenuItem>
            <MenuItem value="Cat">Cat</MenuItem>
            <MenuItem value="Bird">Bird</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Reported">Reported</MenuItem>
            <MenuItem value="Under Treatment">Under Treatment</MenuItem>
            <MenuItem value="Available for Adoption">Available for Adoption</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Animal Cards */}
      {filteredAnimals.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 4 }}>
          No animals found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.image || '/api/placeholder/400/300'}
                  alt={animal.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {animal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {animal.type} • {animal.breed} • Age: {animal.age} years
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                    {animal.description?.substring(0, 100)}...
                  </Typography>
                  <Chip
                    label={animal.status}
                    color={getStatusColor(animal.status)}
                    size="small"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/animals/${animal.id}`)}
                  >
                    View Details
                  </Button>
                  {animal.status === 'Available for Adoption' && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/adoptions/submit/${animal.id}`)}
                    >
                      Adopt
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AnimalList;

