/**
 * Application Routes
 * Defines all routes and their protection levels
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../utils/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard Pages
import Dashboard from '../pages/Dashboard';
import UserDashboard from '../pages/user/UserDashboard';
import VolunteerDashboard from '../pages/volunteer/VolunteerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Animal Pages
import ReportAnimal from '../pages/animals/ReportAnimal';
import AnimalList from '../pages/animals/AnimalList';
import AnimalDetails from '../pages/animals/AnimalDetails';

// Adoption Pages
import AdoptionList from '../pages/adoption/AdoptionList';
import SubmitAdoption from '../pages/adoption/SubmitAdoption';

// Donation Pages
import DonationList from '../pages/donation/DonationList';
import MakeDonation from '../pages/donation/MakeDonation';

// Health Pages
import HealthRecords from '../pages/health/HealthRecords';
import VaccinationSchedule from '../pages/health/VaccinationSchedule';

// Shelter Pages
import ShelterManagement from '../pages/shelter/ShelterManagement';

// Community Pages
import Campaigns from '../pages/community/Campaigns';
import Events from '../pages/community/Events';
import SuccessStories from '../pages/community/SuccessStories';

// Profile
import Profile from '../pages/Profile';

/**
 * AppRoutes Component
 * Main routing configuration
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Role-based Dashboards */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute requiredRole="VOLUNTEER">
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Animal Routes */}
      <Route
        path="/animals"
        element={
          <ProtectedRoute>
            <AnimalList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/animals/report"
        element={
          <ProtectedRoute>
            <ReportAnimal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/animals/:id"
        element={
          <ProtectedRoute>
            <AnimalDetails />
          </ProtectedRoute>
        }
      />

      {/* Adoption Routes */}
      <Route
        path="/adoptions"
        element={
          <ProtectedRoute>
            <AdoptionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adoptions/submit/:animalId"
        element={
          <ProtectedRoute>
            <SubmitAdoption />
          </ProtectedRoute>
        }
      />

      {/* Donation Routes */}
      <Route
        path="/donations"
        element={
          <ProtectedRoute>
            <DonationList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations/make"
        element={
          <ProtectedRoute>
            <MakeDonation />
          </ProtectedRoute>
        }
      />

      {/* Health Routes */}
      <Route
        path="/health/records"
        element={
          <ProtectedRoute>
            <HealthRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/vaccinations"
        element={
          <ProtectedRoute>
            <VaccinationSchedule />
          </ProtectedRoute>
        }
      />

      {/* Shelter Routes */}
      <Route
        path="/shelters"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'VOLUNTEER']}>
            <ShelterManagement />
          </ProtectedRoute>
        }
      />

      {/* Community Routes */}
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stories"
        element={
          <ProtectedRoute>
            <SuccessStories />
          </ProtectedRoute>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

