import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/apiService';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import LoadingSpinner from '../components/LoadingSpinner';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link. Please request a new password reset.');
            setValidating(false);
            return;
        }

        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            await authAPI.validateResetToken(token);
            setTokenValid(true);
        } catch (err) {
            setError('This password reset link is invalid or has expired. Please request a new one.');
            setTokenValid(false);
        } finally {
            setValidating(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.resetPassword({
                token,
                newPassword: formData.newPassword
            });
            setSuccess(response.message || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return <LoadingSpinner />;
    }

    if (!tokenValid) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-5 text-center">
                                <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                                <h4 className="mt-3 mb-3">Invalid Reset Link</h4>
                                <p className="text-muted mb-4">{error}</p>
                                <Link to="/forgot-password" className="btn btn-primary">
                                    Request New Reset Link
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white text-center py-4">
                            <h3 className="mb-0">
                                <i className="bi bi-shield-lock me-2"></i>
                                Reset Password
                            </h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <p className="text-muted text-center mb-4">
                                Enter your new password below.
                            </p>

                            <ErrorAlert message={error} onClose={() => setError('')} />
                            <SuccessAlert message={success} onClose={() => setSuccess('')} />

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        size="lg"
                                    />
                                    <Form.Text className="text-muted">
                                        Must be at least 6 characters long
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        size="lg"
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2 mb-3">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Reset Password
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <Link to="/login" className="text-decoration-none">
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Back to Login
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
