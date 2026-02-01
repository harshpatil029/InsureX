# Quick Start Guide - InsureX Frontend

## Prerequisites
Before starting, ensure you have:
- ✅ Node.js (v14 or higher) installed
- ✅ Backend API running on http://localhost:8080
- ✅ MySQL database configured and running

## Quick Start Steps

### 1. Navigate to Project Directory
```bash
cd insurance-frontend
```

### 2. Install Dependencies (Already Done)
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will automatically open at **http://localhost:3000**

### 4. Test the Application

#### Create Admin User
1. Click "Register"
2. Fill in the form:
   - Full Name: Admin User
   - Username: admin
   - Email: admin@insurex.com
   - Password: admin123
   - Role: Admin
3. Click "Register"

#### Login as Admin
1. Click "Login"
2. Enter credentials:
   - Username: admin
   - Password: admin123
3. Click "Login"

#### Create Policies (Admin Only)
1. Navigate to "Policies" in the menu
2. Click "+ Create New Policy"
3. Fill in policy details:
   - Policy Name: Health Insurance Premium
   - Policy Type: Health
   - Coverage Amount: 100000
   - Premium Amount: 500
   - Description: Comprehensive health coverage
4. Click "Create"

#### Create Customer User
1. Logout (click Logout in navigation)
2. Click "Register"
3. Fill in the form:
   - Full Name: John Doe
   - Username: customer
   - Email: customer@email.com
   - Password: customer123
   - Role: Customer
4. Click "Register"

#### Test Customer Features
1. Login with:
   - Username: customer
   - Password: customer123
2. Go to "My Policies"
3. Browse available policies
4. Click "Enroll Now" on a policy
5. Confirm enrollment
6. Go to "My Claims"
7. Click "+ File New Claim"
8. Fill claim details and submit

#### Approve Claims (Admin)
1. Logout and login as admin
2. Go to "Claims"
3. Click "Approve" or "Reject" on pending claims

## Application Features

### 🔐 Authentication
- [x] JWT-based login/logout
- [x] Role-based access control
- [x] Secure token storage
- [x] Auto-redirect on 401

### 👨‍💼 Admin Features
- [x] Policy CRUD operations
- [x] Customer management
- [x] Claims approval/rejection
- [x] System-wide dashboard

### 👤 Customer Features
- [x] Browse available policies
- [x] Enroll in policies
- [x] File insurance claims
- [x] Track claim status
- [x] Personal dashboard

### 🎨 UI/UX
- [x] Responsive Bootstrap design
- [x] Form validation
- [x] Loading states
- [x] Error/success notifications
- [x] Clean, modern interface

## File Structure

```
src/
├── components/          # Reusable components
│   ├── ErrorAlert.jsx
│   ├── SuccessAlert.jsx
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── context/
│   └── AuthContext.js   # Auth state management
├── pages/               # Route pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Policies.jsx
│   ├── Customers.jsx
│   ├── Claims.jsx
│   ├── MyPolicies.jsx
│   ├── MyClaims.jsx
│   └── Unauthorized.jsx
├── services/
│   └── apiService.js    # API endpoints
├── utils/
│   └── api.js           # Axios config
├── App.js               # Routes
└── index.js             # Entry point
```

## Common Issues & Solutions

### Issue: Backend Connection Error
**Solution**: Ensure backend is running on http://localhost:8080
```bash
# In backend directory
./mvnw spring-boot:run
```

### Issue: CORS Error
**Solution**: Backend must have CORS enabled for http://localhost:3000

### Issue: 404 on Customer Profile
**Solution**: Register as customer, then backend will auto-create profile

### Issue: Token Expired
**Solution**: Logout and login again (token valid for 1 hour)

## API Endpoints Used

### Auth
- POST /auth/login
- POST /auth/register

### Customers
- GET /customers
- GET /customers/{id}
- GET /customers/user/{userId}
- POST /customers
- PUT /customers/{id}
- DELETE /customers/{id}

### Policies
- GET /policies
- GET /policies/{id}
- POST /policies
- PUT /policies/{id}
- DELETE /policies/{id}

### Claims
- GET /claims
- GET /claims/enrollment/{enrollmentId}
- POST /claims
- PATCH /claims/{id}/status

### Enrollments
- POST /customer-policies/enroll
- GET /customer-policies/customer/{customerId}
- GET /customer-policies/{id}

### Payments
- POST /customer-payments
- GET /customer-payments/enrollment/{enrollmentId}
- GET /customer-payments

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (not recommended)
npm run eject
```

## Environment Configuration

Edit `.env` file to change API URL:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Next Steps

1. ✅ Application is fully functional
2. 🎯 Test all features
3. 🔧 Customize as needed
4. 🚀 Deploy to production

## Production Build

```bash
npm run build
```

Builds the app for production in the `build/` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Support

- Backend documentation: See InsuranceManagementSystem README
- React documentation: https://reactjs.org/
- Bootstrap documentation: https://getbootstrap.com/
- React Bootstrap: https://react-bootstrap.github.io/

---

**Congratulations!** Your InsureX frontend is ready to use! 🎉
