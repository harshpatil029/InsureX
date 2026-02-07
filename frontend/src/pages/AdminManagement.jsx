import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { authAPI } from '../services/apiService';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';

const AdminManagement = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'ROLE_ADMIN',
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Transform data to match backend RegisterRequestDTO
            const { confirmPassword, fullName, role, ...rest } = formData;
            const registrationData = {
                ...rest,
                roles: [role] // Backend expects roles as array
            };

            await authAPI.register(registrationData);

            setSuccessMessage('Admin user created successfully!');

            // Reset form
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                role: 'ROLE_ADMIN',
            });
            setErrors({});
        } catch (err) {
            console.error('Error creating admin:', err);
            setErrorMessage(err.response?.data?.message || 'Failed to create admin user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Admin User Management</h2>
                    <p className="text-muted">Create new administrator accounts</p>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <h4 className="mb-4">Create New Admin User</h4>

                            <ErrorAlert
                                message={errorMessage}
                                onClose={() => setErrorMessage('')}
                            />

                            <SuccessAlert
                                message={successMessage}
                                onClose={() => setSuccessMessage('')}
                            />

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.fullName}
                                        placeholder="Enter full name"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        isInvalid={!!errors.username}
                                        placeholder="Choose a username"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                        placeholder="Enter email address"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                isInvalid={!!errors.password}
                                                placeholder="Create a password"
                                                disabled={loading}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                isInvalid={!!errors.confirmPassword}
                                                placeholder="Confirm password"
                                                disabled={loading}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="ROLE_ADMIN">Admin</option>
                                        <option value="ROLE_AGENT">Agent</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Select the role for this user. Admins have full system access.
                                    </Form.Text>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Creating User...
                                        </>
                                    ) : (
                                        'Create Admin User'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Important Notes</h5>
                            <ul className="small text-muted">
                                <li className="mb-2">Only administrators can create new admin accounts</li>
                                <li className="mb-2">The first admin is seeded automatically by the backend</li>
                                <li className="mb-2">Admin users have full system access including user management</li>
                                <li className="mb-2">Use strong passwords for admin accounts</li>
                                <li>Admin credentials should be kept secure</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-3">
                        <Card.Body>
                            <h6 className="mb-3">Default Admin Credentials</h6>
                            <p className="small text-muted mb-2">
                                <strong>First Admin (Backend Seeded):</strong>
                            </p>
                            <div className="bg-light p-2 rounded">
                                <p className="small mb-1"><strong>Username:</strong> admin</p>
                                <p className="small mb-0"><strong>Password:</strong> (configured in backend)</p>
                            </div>
                            <p className="small text-muted mt-2">
                                Please change the default admin password after first login.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminManagement;
