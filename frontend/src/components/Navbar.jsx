import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { formatUsername } from '../utils/helpers';

const Navigation = () => {
    const { isAuthenticated, user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = hasRole('ROLE_ADMIN');
    const isAgent = hasRole('ROLE_AGENT');
    const isCustomer = hasRole('ROLE_CUSTOMER');

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm sticky-top py-3">
            <Container>
                <Navbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"} className="fw-bold d-flex align-items-center">
                    <i className="bi bi-shield-shaded me-2"></i>
                    InsureX
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center">
                                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                                </Nav.Link>

                                {(isAdmin || isAgent) && (
                                    <>
                                        <Nav.Link as={Link} to="/customers" className="d-flex align-items-center">
                                            <i className="bi bi-people me-1"></i> Customers
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/policies" className="d-flex align-items-center">
                                            <i className="bi bi-journal-text me-1"></i> Policies
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/claims" className="d-flex align-items-center">
                                            <i className="bi bi-clipboard2-check me-1"></i> Review Claims
                                        </Nav.Link>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        {/* Policies moved up */}
                                        <Nav.Link as={Link} to="/admin-management" className="d-flex align-items-center">
                                            <i className="bi bi-gear me-1"></i> Management
                                        </Nav.Link>
                                    </>
                                )}

                                {isCustomer && (
                                    <>
                                        <Nav.Link as={Link} to="/my-policies" className="d-flex align-items-center">
                                            <i className="bi bi-search me-1"></i> Browse Policies
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/my-claims" className="d-flex align-items-center">
                                            <i className="bi bi-file-earmark-plus me-1"></i> My Claims
                                        </Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center me-2">
                                    <i className="bi bi-person-circle me-1"></i>
                                    <span className="d-none d-md-inline">Profile</span>
                                </Nav.Link>
                                <div className="d-none d-lg-flex align-items-center me-3 text-white-50">
                                    <small className="me-2">Signed in as</small>
                                    <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fw-bold shadow-sm">
                                        {formatUsername(user?.username)}
                                    </Badge>
                                </div>
                                <Button variant="outline-light" size="sm" onClick={handleLogout} className="rounded-pill px-3">
                                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="px-3">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="light" size="sm" className="rounded-pill px-4 text-primary fw-bold shadow-sm ms-lg-2">
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
