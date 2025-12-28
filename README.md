# Community Animal Welfare & Support Portal

A comprehensive full-stack React application for managing animal welfare operations, built as an MCA final-year project.

## 🎯 Project Overview

This portal enables communities to report animals in distress, manage adoptions, track donations, monitor health records, and coordinate volunteer activities. The application features role-based access control with three user types: **Users**, **Volunteers**, and **Administrators**.

## ✨ Features

### 1. **User Module**
- User registration and authentication
- Role-based dashboards (User, Volunteer, Admin)
- Profile management
- Participation history tracking

### 2. **Pet Reporting Module**
- Report animals in distress with detailed information
- Location tracking (latitude/longitude)
- Condition severity assessment
- Image upload support (local preview)
- Admin/Volunteer assignment and status updates

### 3. **Adoption & Fostering Module**
- Browse available animals for adoption
- Submit adoption/foster requests
- Admin approval/rejection workflow
- Request status tracking

### 4. **Vaccination & Health Module**
- Animal health records management
- Vaccination schedules
- Treatment history
- Reminder system simulation

### 5. **Food & Shelter Module**
- Shelter capacity monitoring
- Feeding schedules
- Resource allocation tracking
- Volunteer activity logs

### 6. **Donation Module**
- Monetary donations
- In-kind donations
- Donation history
- Admin donation utilization tracking
- Analytics dashboard with charts

### 7. **Awareness & Community Module**
- Campaign creation and management
- Events listing
- Success stories
- Community announcements

### 8. **Admin Dashboard**
- Comprehensive analytics
- Total animals rescued
- Adoption statistics
- Donation analytics
- Volunteer participation metrics
- Interactive charts (Chart.js)

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM** - Navigation and routing
- **Material UI (MUI)** - UI components
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client (prepared for API calls)
- **Chart.js / React-Chartjs-2** - Data visualization
- **Google Maps API** - Location services (mock coordinates)

### Backend (Local API)
- **LocalStorage-based API** - Simulates REST API
- **JSON data files** - Mock database
- **CRUD operations** - Full data management

### Authentication
- **Local authentication** - Mock login/register
- **Role-based access control** - USER, VOLUNTEER, ADMIN
- **Protected routes** - Route-level security

## 📁 Project Structure

```
src/
├── api/                    # API service functions
│   ├── animals.api.js
│   ├── users.api.js
│   ├── donations.api.js
│   ├── volunteers.api.js
│   ├── adoptions.api.js
│   ├── campaigns.api.js
│   ├── events.api.js
│   ├── stories.api.js
│   └── shelters.api.js
├── components/             # Reusable components
│   └── layout/
│       ├── Layout.jsx
│       └── NavMenu.jsx
├── context/                # React Context
│   └── AuthContext.jsx
├── data/                   # Mock JSON database
│   ├── users.json
│   ├── animals.json
│   ├── donations.json
│   ├── adoptions.json
│   ├── volunteers.json
│   ├── campaigns.json
│   ├── events.json
│   ├── stories.json
│   └── shelters.json
├── pages/                  # Page components
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard.jsx
│   ├── user/
│   │   └── UserDashboard.jsx
│   ├── volunteer/
│   │   └── VolunteerDashboard.jsx
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   ├── animals/
│   │   ├── AnimalList.jsx
│   │   ├── AnimalDetails.jsx
│   │   └── ReportAnimal.jsx
│   ├── adoption/
│   │   ├── AdoptionList.jsx
│   │   └── SubmitAdoption.jsx
│   ├── donation/
│   │   ├── DonationList.jsx
│   │   └── MakeDonation.jsx
│   ├── health/
│   │   ├── HealthRecords.jsx
│   │   └── VaccinationSchedule.jsx
│   ├── shelter/
│   │   └── ShelterManagement.jsx
│   ├── community/
│   │   ├── Campaigns.jsx
│   │   ├── Events.jsx
│   │   └── SuccessStories.jsx
│   └── Profile.jsx
├── routes/                 # Routing configuration
│   └── AppRoutes.jsx
├── services/               # Service utilities
│   └── api.js
├── utils/                  # Utility functions
│   └── ProtectedRoute.jsx
├── App.jsx                 # Main App component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd Community-Animal-Welfare-Support-Portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Open your browser:**
   The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🔐 Demo Credentials

The application comes with pre-configured demo accounts:

### Admin Account
- **Email:** admin@animalwelfare.com
- **Password:** admin123
- **Access:** Full system access, analytics dashboard

### Volunteer Account
- **Email:** volunteer@example.com
- **Password:** volunteer123
- **Access:** Task management, assigned animals

### User Account
- **Email:** user@example.com
- **Password:** user123
- **Access:** Report animals, adoptions, donations

## 📊 Data Models

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "USER",
  "phone": "1234567890"
}
```

### Animal
```json
{
  "id": 1,
  "type": "Dog",
  "name": "Buddy",
  "condition": "Healthy",
  "status": "Available for Adoption",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

### Donation
```json
{
  "id": 1,
  "userId": 1,
  "type": "Monetary",
  "amount": 5000,
  "date": "2024-01-15T00:00:00Z"
}
```

## 🎨 Key Features Explained

### Role-Based Access Control
- **Users:** Can report animals, submit adoption requests, make donations
- **Volunteers:** Can view assigned tasks, update animal status
- **Admins:** Full access including analytics, user management, campaign creation

### Local API System
- All data is stored in browser localStorage
- Simulates REST API with CRUD operations
- Data persists across sessions
- JSON files serve as initial data seed

### Protected Routes
- Authentication required for all pages except login/register
- Role-based route protection
- Automatic redirects for unauthorized access

## 📈 Admin Dashboard Features

- **Total Animals Rescued:** Count of all reported animals
- **Adoption Statistics:** Approved, pending, rejected requests
- **Donation Analytics:** Monthly trends, total donations
- **Volunteer Metrics:** Active volunteers, task completion
- **Interactive Charts:** Doughnut charts, bar charts, line charts

## 🔧 Customization

### Adding New Features
1. Create API function in `src/api/`
2. Add route in `src/routes/AppRoutes.jsx`
3. Create page component in `src/pages/`
4. Update navigation menu if needed

### Styling
- Material UI theme can be customized in `src/App.jsx`
- Tailwind CSS classes can be used throughout
- Component-level styling with MUI `sx` prop

## 📝 Notes for Academic Submission

### Code Quality
- All components are well-commented
- Functions include JSDoc-style comments
- Code follows React best practices
- Modular and maintainable structure

### Documentation
- README includes setup instructions
- Code comments explain logic for viva
- Clear project structure
- Feature documentation

### Demonstration
- Pre-loaded dummy data for easy demo
- Multiple user roles for testing
- Complete CRUD operations
- Responsive design for all devices

## 🐛 Troubleshooting

### Issue: Dependencies not installing
**Solution:** Clear npm cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Solution:** Change port in `vite.config.js` or use:
```bash
npm run dev -- --port 3001
```

### Issue: Data not persisting
**Solution:** Check browser localStorage is enabled. Data is stored locally in browser.

## 📄 License

This project is created for academic purposes as an MCA final-year project.

## 👥 Author

MCA Final Year Project - Community Animal Welfare & Support Portal

## 🙏 Acknowledgments

- Material UI for component library
- Chart.js for data visualization
- React community for excellent documentation

---

**Note:** This is a demonstration project using local storage. For production use, integrate with a real backend API and database.
