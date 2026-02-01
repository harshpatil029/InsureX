import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import Customers from './pages/Customers';
import Claims from './pages/Claims';
import MyPolicies from './pages/MyPolicies';
import MyClaims from './pages/MyClaims';
import Unauthorized from './pages/Unauthorized';
import AdminManagement from './pages/AdminManagement';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - All authenticated users */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/policies"
              element={
                <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_AGENT']}>
                  <Policies />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_AGENT']}>
                  <Customers />
                </PrivateRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_AGENT']}>
                  <Claims />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-management"
              element={
                <PrivateRoute roles={['ROLE_ADMIN']}>
                  <AdminManagement />
                </PrivateRoute>
              }
            />

            {/* Customer Only Routes */}
            <Route
              path="/my-policies"
              element={
                <PrivateRoute roles={['ROLE_CUSTOMER']}>
                  <MyPolicies />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-claims"
              element={
                <PrivateRoute roles={['ROLE_CUSTOMER']}>
                  <MyClaims />
                </PrivateRoute>
              }
            />

            {/* Profile - All authenticated users */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
