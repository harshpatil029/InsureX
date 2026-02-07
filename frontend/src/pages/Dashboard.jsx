import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    customerAPI,
    policyAPI,
    claimAPI,
    customerPolicyAPI,
    paymentAPI
} from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatUsername } from '../utils/helpers';

const Dashboard = () => {
    const { user, hasRole } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            // Determine role by any means necessary
            const isAdmin = hasRole('ROLE_ADMIN') || user?.role === 'ROLE_ADMIN';
            const isCustomer = hasRole('ROLE_CUSTOMER') || user?.role === 'ROLE_CUSTOMER';
            const isAgent = hasRole('ROLE_AGENT') || user?.role === 'ROLE_AGENT';

            if (isAdmin) {
                const [customers, policies, claims] = await Promise.all([
                    customerAPI.getAll().catch(() => []),
                    policyAPI.getAll().catch(() => []),
                    claimAPI.getAll().catch(() => []),
                ]);

                setStats({
                    totalCustomers: customers.length,
                    totalPolicies: policies.length,
                    totalClaims: claims.length,
                    pendingClaims: (claims || []).filter(c => c.status === 'PENDING').length,
                });
            } else if (isCustomer) {
                try {
                    const customerData = await customerAPI.getByUserId(user.id);
                    const enrollments = await customerPolicyAPI.getByCustomer(customerData.id);

                    let allClaims = [];
                    let allPayments = [];

                    for (const enrollment of enrollments) {
                        try {
                            const claims = await claimAPI.getByEnrollment(enrollment.id);
                            const payments = await paymentAPI.getByEnrollment(enrollment.id);
                            allClaims = [...allClaims, ...claims];
                            allPayments = [...allPayments, ...payments];
                        } catch (err) {
                            console.log('Error fetching enrollment data:', err);
                        }
                    }

                    setStats({
                        activePolicies: enrollments.filter(e => e.status === 'ACTIVE').length,
                        totalEnrollments: enrollments.length,
                        totalClaims: allClaims.length,
                        pendingClaims: allClaims.filter(c => c.status === 'PENDING').length,
                        approvedClaims: allClaims.filter(c => c.status === 'APPROVED').length,
                        totalPayments: allPayments.length,
                    });
                } catch (err) {
                    console.log('Customer profile fetch failed, likely a new user.', err);
                    setStats({
                        activePolicies: 0,
                        totalEnrollments: 0,
                        noProfile: true
                    });
                }
            } else if (isAgent) {
                console.log('📬 Fetching Agent Stats');
                const [customers, claims] = await Promise.all([
                    customerAPI.getAll().catch(() => []),
                    claimAPI.getAll().catch(() => []),
                ]);

                setStats({
                    totalCustomers: customers.length,
                    totalClaims: claims.length,
                    pendingClaims: (claims || []).filter(c => c.status === 'PENDING').length,
                });
            } else {
                console.log('⚠️ No specific role detected for stats fetching');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const isAdmin = hasRole('ROLE_ADMIN') || user?.role === 'ROLE_ADMIN';
    const isCustomer = hasRole('ROLE_CUSTOMER') || user?.role === 'ROLE_CUSTOMER';
    const isAgent = hasRole('ROLE_AGENT') || user?.role === 'ROLE_AGENT';

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="mb-1">Welcome, {formatUsername(user?.username)}!</h2>
                    <p className="text-muted mb-0">
                        {isAdmin && 'System Administration Dashboard'}
                        {isCustomer && 'Your Personal Insurance Dashboard'}
                        {isAgent && 'Insurance Agent Management Console'}
                        {!isAdmin && !isCustomer && !isAgent && 'Dashboard Information'}
                    </p>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={fetchDashboardData}
                        className="rounded-pill px-3 shadow-sm"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </Button>
                </Col>
            </Row>

            <ErrorAlert message={error} onClose={() => setError('')} />

            {/* Quick Start for New Users or No Role Detected */}
            {(!isAdmin && !isCustomer && !isAgent) || (isCustomer && stats.totalEnrollments === 0) ? (
                <Card className="shadow-sm border-0 border-top border-primary border-4 mb-5">
                    <Card.Body className="p-4 p-md-5 text-center">
                        <i className="bi bi-rocket-takeoff text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                        <h3>Ready to Get Protected?</h3>
                        <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
                            You currently don't have any active insurance policies.
                            Browse our curated protection plans to find the right coverage for you and your family.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="primary" size="lg" onClick={() => navigate('/my-policies')} className="px-5 rounded-pill shadow">
                                Browse Policies
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : null}

            {/* Admin Stats */}
            {isAdmin && (
                <Row>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-primary border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Customers</h6>
                                <h3 className="mb-0">{stats.totalCustomers || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-success border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Policies</h6>
                                <h3 className="mb-0">{stats.totalPolicies || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-info border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Claims</h6>
                                <h3 className="mb-0">{stats.totalClaims || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-warning border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Pending Claims</h6>
                                <h3 className="mb-0">{stats.pendingClaims || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Customer Stats */}
            {isCustomer && stats.totalEnrollments > 0 && (
                <Row>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-primary border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Active Policies</h6>
                                <h3 className="mb-0">{stats.activePolicies || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-success border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Payments</h6>
                                <h3 className="mb-0">{stats.totalPayments || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Agent Stats */}
            {isAgent && (
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-primary border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Customers</h6>
                                <h3 className="mb-0">{stats.totalCustomers || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-success border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Total Claims</h6>
                                <h3 className="mb-0">{stats.totalClaims || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100 border-0 border-start border-warning border-4">
                            <Card.Body>
                                <h6 className="text-muted mb-1 small">Pending Claims</h6>
                                <h3 className="mb-0">{stats.pendingClaims || 0}</h3>
                                <div className="mt-2">
                                    <small className="text-muted">Requires Attention</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <hr className="my-5" />

            <Row>
                <Col>
                    <h5 className="mb-4">Quick Access</h5>
                    <div className="d-flex gap-2 flex-wrap">
                        {isAdmin && (
                            <>
                                <Button variant="light" className="border shadow-sm px-4" onClick={() => navigate('/policies')}>Policies</Button>
                                <Button variant="light" className="border shadow-sm px-4" onClick={() => navigate('/customers')}>Customers</Button>
                                <Button variant="light" className="border shadow-sm px-4" onClick={() => navigate('/claims')}>Claims</Button>
                                <Button variant="light" className="border shadow-sm px-4" onClick={() => navigate('/admin-management')}>Users</Button>
                            </>
                        )}
                        {isAgent && (
                            <>
                                <Button variant="primary" className="shadow-sm px-4 rounded-pill" onClick={() => navigate('/claims')}>
                                    <i className="bi bi-inbox-fill me-2"></i>Process Claims
                                </Button>
                                <Button variant="outline-primary" className="shadow-sm px-4 rounded-pill" onClick={() => navigate('/customers')}>
                                    <i className="bi bi-people-fill me-2"></i>Customers
                                </Button>
                            </>
                        )}
                        {isCustomer && (
                            <>
                                <Button variant="primary" className="shadow-sm px-4 rounded-pill" onClick={() => navigate('/my-policies')}>My Policies</Button>
                                <Button variant="outline-primary" className="shadow-sm px-4 rounded-pill" onClick={() => navigate('/my-claims')}>My Claims</Button>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
