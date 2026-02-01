import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/apiService';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authAPI.forgotPassword({ email });
            setSuccess(response.message || 'Password reset link has been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white text-center py-4">
                            <h3 className="mb-0">
                                <i className="bi bi-key me-2"></i>
                                Forgot Password
                            </h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <p className="text-muted text-center mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <ErrorAlert message={error} onClose={() => setError('')} />
                            <SuccessAlert message={success} onClose={() => setSuccess('')} />

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-envelope me-2"></i>
                                                Send Reset Link
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

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Don't have an account? <Link to="/register">Register here</Link>
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
