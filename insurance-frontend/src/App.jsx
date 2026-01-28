import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import Customers from './pages/Customers';
import Claims from './pages/Claims';
import Payments from './pages/Payments';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AgentDashboard from './pages/dashboards/AgentDashboard';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import MainLayout from './components/MainLayout';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Layout Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Role-Specific Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/policies" element={<PrivateRoute requiredRole="ROLE_ADMIN"><Policies /></PrivateRoute>} />
            <Route path="/admin/customers" element={<PrivateRoute requiredRole="ROLE_ADMIN"><Customers /></PrivateRoute>} />

            <Route path="/agent/dashboard" element={<PrivateRoute requiredRole="ROLE_AGENT"><AgentDashboard /></PrivateRoute>} />
            <Route path="/agent/policies" element={<PrivateRoute requiredRole="ROLE_AGENT"><Policies /></PrivateRoute>} />
            <Route path="/agent/customers" element={<PrivateRoute requiredRole="ROLE_AGENT"><Customers /></PrivateRoute>} />
            <Route path="/agent/claims" element={<PrivateRoute requiredRole="ROLE_AGENT"><Claims /></PrivateRoute>} />

            <Route path="/customer/dashboard" element={<PrivateRoute requiredRole="ROLE_CUSTOMER"><CustomerDashboard /></PrivateRoute>} />
            <Route path="/customer/claims" element={<PrivateRoute requiredRole="ROLE_CUSTOMER"><Claims /></PrivateRoute>} />
            <Route path="/customer/policies" element={<PrivateRoute requiredRole="ROLE_CUSTOMER"><Policies /></PrivateRoute>} />
            <Route path="/customer/payments" element={<PrivateRoute requiredRole="ROLE_CUSTOMER"><Payments /></PrivateRoute>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
