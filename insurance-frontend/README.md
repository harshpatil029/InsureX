# InsureX - Insurance Management Frontend

A responsive React.js frontend application for the InsureX Insurance Management System. This application provides a comprehensive user interface for managing insurance policies, customers, claims, and enrollments.

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure login and registration system
- **Role-based Access Control**: Different interfaces for Admin, Agent, and Customer roles
- **Protected Routes**: Automatic redirection based on authentication status and user roles
- **Token Management**: Automatic token storage and refresh handling

### Core Functionality

#### Admin Features
- **Policy Management**: Full CRUD operations for insurance policies
- **Customer Management**: View, edit, and manage customer profiles
- **Claims Management**: Review and approve/reject customer claims
- **User Management**: Create new admin and agent users (admins cannot self-register)
- **Dashboard**: Overview of total customers, policies, and claims

#### Customer Features
- **Policy Enrollment**: Browse and enroll in available insurance policies
- **My Policies**: View all enrolled policies and their status
- **Claims Filing**: Submit new claims for enrolled policies
- **My Claims**: Track status of filed claims
- **Dashboard**: Personal overview of active policies and claims

#### Agent Features
- **Customer Access**: View and manage customer information
- **Claims Review**: Monitor and process claims

### Technical Features
- **Responsive Design**: Bootstrap-based UI that works on all devices
- **Form Validation**: Client-side validation with error messages
- **Error Handling**: Global error handling for API failures (401/403)
- **Loading States**: User-friendly loading indicators for async operations
- **Success/Error Notifications**: Clear feedback for user actions
- **Centralized API Layer**: All API calls organized in a single service file

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Running InsureX Backend API (on http://localhost:8080)

## 🛠️ Installation

1. **Navigate to the project directory**:
   ```bash
   cd insurance-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - The `.env` file is already created with default settings
   - Update `REACT_APP_API_BASE_URL` if your backend runs on a different port
   ```
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `build` folder.

### Run Tests
```bash
npm test
```

## 📁 Project Structure

```
insurance-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorAlert.jsx
│   │   ├── SuccessAlert.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.js   # Authentication state management
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Policies.jsx     # Admin: Manage policies
│   │   ├── Customers.jsx    # Admin/Agent: Manage customers
│   │   ├── Claims.jsx       # Admin/Agent: Manage claims
│   │   ├── MyPolicies.jsx   # Customer: View and enroll in policies
│   │   ├── MyClaims.jsx     # Customer: File and track claims
│   │   ├── AdminManagement.jsx  # Admin: Create admin/agent users
│   │   └── Unauthorized.jsx
│   ├── services/            # API services
│   │   └── apiService.js    # Centralized API calls
│   ├── utils/               # Utility functions
│   │   └── api.js           # Axios instance with interceptors
│   ├── App.js               # Main app component with routing
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🔐 Authentication Flow

1. **Registration**: Users register with username, email, password, and role (Customer/Agent only)
   - Admin accounts can only be created by existing administrators
   - First admin is automatically seeded by the backend
2. **Login**: Backend returns JWT token upon successful authentication
3. **Token Storage**: Token is stored in localStorage
4. **Token Injection**: Axios interceptor automatically adds token to all requests
5. **Auto Logout**: 401 responses trigger automatic logout and redirect to login

## 🎨 UI Components

### Reusable Components
- **ErrorAlert**: Displays error messages with dismiss functionality
- **SuccessAlert**: Displays success messages with dismiss functionality
- **LoadingSpinner**: Shows loading state during async operations
- **PrivateRoute**: Wraps protected routes with authentication check

### Navigation
- Dynamic navigation menu based on user role
- Displays current user information
- Logout functionality

## 🔄 API Integration

All API endpoints are centralized in `src/services/apiService.js`:

### Auth API
- `login(credentials)`: Authenticate user
- `register(userData)`: Register new user
- `logout()`: Clear authentication data

### Customer API
- `getAll()`: Get all customers
- `getById(id)`: Get customer by ID
- `getByUserId(userId)`: Get customer by user ID
- `create(data)`: Create new customer
- `update(id, data)`: Update customer
- `delete(id)`: Delete customer

### Policy API
- `getAll()`: Get all policies
- `getById(id)`: Get policy by ID
- `create(data)`: Create new policy
- `update(id, data)`: Update policy
- `delete(id)`: Delete policy

### Claim API
- `getAll()`: Get all claims
- `getByEnrollment(enrollmentId)`: Get claims by enrollment
- `create(data)`: Create new claim
- `updateStatus(id, status)`: Update claim status

### Customer Policy API
- `enroll(data)`: Enroll in a policy
- `getByCustomer(customerId)`: Get enrollments by customer
- `getById(id)`: Get enrollment by ID
- `updateStatus(id, status)`: Update enrollment status

### Payment API
- `create(data)`: Create payment
- `getByEnrollment(enrollmentId)`: Get payments by enrollment
- `getAll()`: Get all payments

## 🛡️ Role-Based Access

### Admin (ROLE_ADMIN)
- Full access to all features
- Policy CRUD operations
- Customer management
- Claims approval/rejection
- User management (create admin/agent accounts)
- View all system data
- Cannot self-register (requires existing admin or backend seed)

### Agent (ROLE_AGENT)
- Customer management
- View claims
- Limited administrative access

### Customer (ROLE_CUSTOMER)
- Enroll in policies
- View enrolled policies
- File claims
- Track claim status
- Personal dashboard

## 🔧 Configuration

### Environment Variables
- `REACT_APP_API_BASE_URL`: Backend API base URL (default: http://localhost:8080)

### API Interceptors
- **Request Interceptor**: Adds JWT token to Authorization header
- **Response Interceptor**: Handles 401/403 errors globally

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Bootstrap's grid system ensures optimal layout on all screen sizes.

## ✅ Form Validation

All forms include:
- Required field validation
- Format validation (email, numbers, etc.)
- Real-time error feedback
- Disabled state during submission
- Clear error messages

## 🚨 Error Handling

- **Network Errors**: Graceful handling with user-friendly messages
- **401 Unauthorized**: Automatic logout and redirect to login
- **403 Forbidden**: Redirect to unauthorized page
- **Validation Errors**: Display field-specific errors
- **Server Errors**: Generic error message with retry option

## 🎯 Best Practices Implemented

- ✅ Functional components with Hooks
- ✅ Centralized API calls
- ✅ Environment variables for configuration
- ✅ No hardcoded credentials
- ✅ No mock data
- ✅ Clean, modular code structure
- ✅ Consistent error handling
- ✅ Loading states for better UX
- ✅ Form validation
- ✅ Protected routes
- ✅ Role-based access control

## 🔗 Integration with Backend

Ensure your backend is running on the configured port (default: 8080) with the following endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `GET /customers`
- `GET /customers/{id}`
- `GET /policies`
- `POST /policies`
- `GET /claims`
- `POST /claims`
- `POST /customer-policies/enroll`
- And all other endpoints defined in the backend controllers

## 📝 Notes

- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Token expiration is set to 1 hour (configurable in backend)
- CORS must be enabled on the backend for the frontend origin
- The application assumes the backend is running with proper CORS configuration

## 🤝 Support

For issues or questions, please refer to the backend repository or contact the development team.

## 📄 License

This project is part of the InsureX Insurance Management System.
