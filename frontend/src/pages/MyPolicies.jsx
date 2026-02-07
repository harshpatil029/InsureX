import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { customerAPI, customerPolicyAPI, policyAPI } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { formatCurrency, formatDate } from '../utils/helpers';

const MyPolicies = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [availablePolicies, setAvailablePolicies] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // Get customer profile
            let customerData;
            try {
                customerData = await customerAPI.getByUserId(user.id);
                setCustomerId(customerData.id);
            } catch (err) {
                console.warn('Customer profile fetch failed:', err);
                // If profile missing, we cannot fetch enrollments, but can show market
                setCustomerId(null);
            }

            // Fetch enrolled policies (if customer exists)
            if (customerData?.id) {
                try {
                    const myEnrolled = await customerPolicyAPI.getByCustomer(customerData.id);
                    setEnrollments(myEnrolled);
                } catch (err) {
                    // Safe to ignore 404/500 here - just means no history yet or backend issue
                    console.log('No existing enrollments found or fetch failed:', err);
                    setEnrollments([]);
                }
            }

            // Fetch available policies
            try {
                const allPolicies = await policyAPI.getAll();
                setAvailablePolicies(allPolicies);
            } catch (err) {
                console.log('Failed to fetch marketplace policies:', err);
                setAvailablePolicies([]);
            }

        } catch (err) {
            console.error('Critical Error fetching data:', err);
            // Only show banner for critical unknown errors
            if (err.message && !err.message.includes('404')) {
                setError('System notice: Some data could not be retrieved.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShowEnroll = (policy) => {
        setSelectedPolicy(policy);
        setShowEnrollModal(true);
    };

    const handleCloseEnroll = () => {
        setShowEnrollModal(false);
        setSelectedPolicy(null);
    };

    const handleEnroll = async () => {
        // Debug check
        // alert("Enrollment function triggered!"); 
        if (!selectedPolicy) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        // Dynamic ID resolution: If customerId is missing, try to fetch it now
        let activeCustomerId = customerId;
        if (!activeCustomerId && user?.id) {
            try {
                console.log("Attempting to fetch missing customer profile...");
                const profile = await customerAPI.getByUserId(user.id);
                activeCustomerId = profile.id;
                setCustomerId(profile.id);
            } catch (e) {
                console.error("Just-in-time profile fetch failed", e);
                setError("Critical: Your customer profile could not be loaded. Please refresh.");
                setSubmitting(false);
                return;
            }
        }

        if (!activeCustomerId) {
            setError("Cannot enroll: User identity verification failed.");
            setSubmitting(false);
            return;
        }

        try {
            await customerPolicyAPI.enroll({
                customerId: activeCustomerId,
                policyId: selectedPolicy.id,
            });

            setSuccess(`Success! You are now covered by ${selectedPolicy.policyName}`);
            handleCloseEnroll();
            fetchData();
        } catch (err) {
            console.error('Error enrolling in policy:', err);
            setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isEnrolled = (policyId) => {
        return enrollments.some(e => e.policyId === policyId);
    };

    const getEnrollmentInfo = (policyId) => {
        return enrollments.find(e => e.policyId === policyId);
    };

    const getPolicyTypeIcon = (type) => {
        if (!type) return 'bi-shield-fill-check';
        const t = type.toLowerCase();
        if (t.includes('health')) return 'bi-heart-pulse-fill';
        if (t.includes('life')) return 'bi-person-vcard-fill';
        if (t.includes('auto') || t.includes('car')) return 'bi-car-front-fill';
        if (t.includes('home')) return 'bi-house-heart-fill';
        if (t.includes('travel')) return 'bi-airplane-fill';
        return 'bi-shield-fill-check';
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <i className="bi bi-person-badge text-primary me-2"></i>
                        My Insurance Portfolio
                    </h2>
                    <p className="text-muted">Manage your coverages and discover new protection plans</p>
                </Col>
                <Col className="text-end d-flex align-items-center justify-content-end">
                    <Button variant="outline-primary" size="sm" onClick={fetchData} className="rounded-pill px-3">
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </Button>
                </Col>
            </Row>

            <ErrorAlert message={error} onClose={() => setError('')} />
            <SuccessAlert message={success} onClose={() => setSuccess('')} />

            {/* Enrolled Policies Section */}
            <h4 className="mb-3 d-flex align-items-center">
                <i className="bi bi-check2-circle text-success me-2"></i>
                Active Coverages
            </h4>

            <Row className="mb-5">
                {enrollments.length === 0 ? (
                    <Col>
                        <Card className="text-center py-5 border-dashed bg-light">
                            <Card.Body>
                                <i className="bi bi-patch-question text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                                <h5>No active policies found</h5>
                                <p className="text-muted">Explore the available plans below and protect what matters most.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : (
                    enrollments.map((enrollment) => {
                        // Find original policy details
                        const details = enrollment.policy || availablePolicies.find(p => p.id === enrollment.policyId);
                        console.log(details);
                        return (
                            <Col md={6} lg={4} key={enrollment.id} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 border-start border-success border-4">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between mb-3">
                                            <Badge bg="success" className="px-3 py-2 rounded-pill fw-normal">
                                                ACTIVE
                                            </Badge>
                                            <small className="text-muted">ID: #{enrollment.id}</small>
                                        </div>
                                        <h5 className="mb-1">{details?.policyName || 'Standard Policy'}</h5>
                                        <div className="text-muted small mb-3">
                                            <i className={`bi ${getPolicyTypeIcon(details?.policyType || '')} me-1`}></i>
                                            {details?.policyType || 'Insurance Plan'}
                                        </div>
                                        <hr className="my-3" />
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Coverage:</span>
                                            <span className="fw-bold text-success">{formatCurrency(details?.coverageAmount)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Deducted:</span>
                                            <span className="fw-bold">{formatCurrency(details?.premiumAmount)}/mo</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-0 small">
                                            <span className="text-muted">Expires:</span>
                                            <span className="text-danger">{formatDate(enrollment.endDate)}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                )}
            </Row>

            {/* Market Section */}
            <h4 className="mb-3 d-flex align-items-center">
                <i className="bi bi-shop text-primary me-2"></i>
                Available Protection Plans
            </h4>

            <Row>
                {availablePolicies.length === 0 ? (
                    <Col>
                        <p className="text-center text-muted py-4">No new policies available at the moment.</p>
                    </Col>
                ) : (
                    availablePolicies.map((policy) => {
                        const enrolled = isEnrolled(policy.id);
                        return (
                            <Col md={6} lg={4} key={policy.id} className="mb-4">
                                <Card className={`h-100 shadow-sm border-0 transition-hover ${enrolled ? 'opacity-75' : ''}`}>
                                    <Card.Body className="d-flex flex-column">
                                        <div className="mb-3">
                                            <i className={`bi ${getPolicyTypeIcon(policy.policyType)} text-primary`} style={{ fontSize: '2rem' }}></i>
                                        </div>
                                        <Card.Title className="fw-bold h5">{policy.policyName}</Card.Title>
                                        <Card.Subtitle className="mb-3 text-muted fw-normal small">
                                            {policy.policyType} Category
                                        </Card.Subtitle>
                                        <Card.Text className="text-muted small mb-4 flex-grow-1">
                                            {policy.description || 'Comprehensive coverage designed for your peace of mind with premium support services included.'}
                                        </Card.Text>
                                        <div className="bg-light p-3 rounded mb-4">
                                            <div className="d-flex justify-content-between mb-1">
                                                <small className="text-muted">Coverage</small>
                                                <small className="fw-bold text-dark">{formatCurrency(policy.coverageAmount)}</small>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <small className="text-muted">Monthly</small>
                                                <small className="fw-bold text-primary">{formatCurrency(policy.premiumAmount)}</small>
                                            </div>
                                        </div>
                                        <Button
                                            variant={enrolled ? 'outline-success' : 'primary'}
                                            className={`w-100 py-2 rounded-pill ${enrolled ? 'disabled' : ''}`}
                                            onClick={() => !enrolled && handleShowEnroll(policy)}
                                        >
                                            {enrolled ? (
                                                <><i className="bi bi-check-lg me-2"></i>You are Enrolled</>
                                            ) : (
                                                <><i className="bi bi-plus-lg me-2"></i>Enroll Now</>
                                            )}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                )}
            </Row>

            {/* Enrollment Modal */}
            <Modal show={showEnrollModal} onHide={handleCloseEnroll} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Confirm Enrollment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {selectedPolicy && (
                        <div className="text-center p-4 bg-light rounded shadow-inner">
                            <i className={`bi ${getPolicyTypeIcon(selectedPolicy.policyType)} text-primary mb-3`} style={{ fontSize: '3rem' }}></i>
                            <h4 className="fw-bold">{selectedPolicy.policyName}</h4>
                            <p className="text-muted mb-4">{selectedPolicy.policyType} Plan</p>

                            <hr />

                            <Row className="text-start mt-3">
                                <Col xs={6} className="text-muted small">Coverage Payout:</Col>
                                <Col xs={6} className="text-end fw-bold">{formatCurrency(selectedPolicy.coverageAmount)}</Col>
                                <Col xs={6} className="text-muted small mt-2">Monthly Premium:</Col>
                                <Col xs={6} className="text-end fw-bold text-primary mt-2">{formatCurrency(selectedPolicy.premiumAmount)}</Col>
                            </Row>
                        </div>
                    )}
                    <p className="text-center mt-4 text-muted small px-3">
                        By confirming, you agree to the terms and conditions and the monthly premium will be billed to your account.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center pb-4">
                    <Button variant="light" onClick={handleCloseEnroll} disabled={submitting} className="px-4 rounded-pill">
                        Go Back
                    </Button>
                    <Button variant="primary" onClick={handleEnroll} disabled={submitting} className="px-4 rounded-pill shadow">
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Securing...
                            </>
                        ) : (
                            'Confirm Enrollment'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyPolicies;
