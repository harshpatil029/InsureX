import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h1 className="display-4 fw-bold mb-4">
                                Welcome to InsureX
                            </h1>
                            <p className="lead mb-4">
                                Your trusted partner for comprehensive insurance solutions.
                                Protect what matters most with our wide range of insurance policies.
                            </p>
                            {!isAuthenticated && (
                                <div>
                                    <Button
                                        as={Link}
                                        to="/register"
                                        variant="light"
                                        size="lg"
                                        className="me-3"
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="outline-light"
                                        size="lg"
                                    >
                                        Login
                                    </Button>
                                </div>
                            )}
                            {isAuthenticated && (
                                <Button
                                    as={Link}
                                    to="/dashboard"
                                    variant="light"
                                    size="lg"
                                >
                                    Go to Dashboard
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="py-5">
                <h2 className="text-center mb-5">Why Choose InsureX?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3">🛡️</div>
                                <Card.Title>Comprehensive Coverage</Card.Title>
                                <Card.Text>
                                    Wide range of insurance policies including health, life, auto, and more.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3">⚡</div>
                                <Card.Title>Quick Claims Processing</Card.Title>
                                <Card.Text>
                                    Fast and efficient claims processing to get you covered when you need it most.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3">💼</div>
                                <Card.Title>Expert Support</Card.Title>
                                <Card.Text>
                                    Dedicated support team ready to help you with all your insurance needs.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* CTA Section */}
            <div className="bg-light py-5">
                <Container className="text-center">
                    <h2 className="mb-4">Ready to Get Protected?</h2>
                    <p className="lead mb-4">
                        Join thousands of satisfied customers who trust InsureX for their insurance needs.
                    </p>
                    {!isAuthenticated && (
                        <Button
                            as={Link}
                            to="/register"
                            variant="primary"
                            size="lg"
                        >
                            Create Your Account Today
                        </Button>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default Home;
