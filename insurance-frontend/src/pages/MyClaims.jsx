import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { customerAPI, customerPolicyAPI, claimAPI } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { formatCurrency, formatDate } from '../utils/helpers';

const MyClaims = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        customerPolicyId: '',
        claimAmount: '',
        claimDate: new Date().toISOString().split('T')[0],
        description: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMyClaims();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchMyClaims = async () => {
        if (!user || !user.id) return;

        setLoading(true);
        setError('');

        try {
            // STEP 1: Get Customer Profile
            // We need this ID to find enrollments.
            let customerData;
            try {
                customerData = await customerAPI.getByUserId(user.id);
            } catch (err) {
                console.warn('Customer profile fetch issue:', err);
                // If we can't find the customer, we can't do anything else.
                // But we don't show a giant error unless it's a network refusal.
                setLoading(false);
                return;
            }

            // STEP 2: Get Enrollments (Policies)
            // This is CRITICAL. If this succeeds, the "File New Claim" button Activates.
            // If the backend returns 500 here (e.g. empty list bug), we catch it and assume []
            let enrollmentData = [];
            try {
                // If the backend 500s on "No policies", this catch block saves the UI.
                enrollmentData = await customerPolicyAPI.getByCustomer(customerData.id);
                setEnrollments(enrollmentData.filter(e => e.status === 'ACTIVE'));
            } catch (err) {
                console.warn('Enrollment fetch soft-fail:', err);
                // Only show error if it's a hard network error (server down)
                if (!err.response) setError('Could not connect to server.');
                setEnrollments([]);
                // We typically stop here if no enrollments, but let's clear loading
                setLoading(false);
                return;
            }

            // STEP 3: Get Claims
            // If this fails (e.g. 500 on empty list), we IGNORE it so the user can still file a NEW claim.
            const allClaims = [];
            for (const enrollment of enrollmentData) {
                try {
                    const claims = await claimAPI.getByEnrollment(enrollment.id);
                    if (Array.isArray(claims)) {
                        allClaims.push(...claims);
                    }
                } catch (err) {
                    // Silent fail: just means no claims or minor API issue.
                    // Enrollments are safe, so user can proceed.
                }
            }

            setClaims(allClaims.sort((a, b) => new Date(b.claimDate) - new Date(a.claimDate)));

        } catch (err) {
            console.error('Unexpected error in flow:', err);
            // Catch-all for React errors
        } finally {
            setLoading(false);
        }
    };

    const handleShowCreate = () => {
        setFormData({
            customerPolicyId: '',
            claimAmount: '',
            claimDate: new Date().toISOString().split('T')[0],
            description: '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const validateForm = () => {
        const errors = {};
        if (!formData.customerPolicyId) errors.customerPolicyId = 'Please select an active policy';
        if (!formData.claimAmount || formData.claimAmount <= 0) errors.claimAmount = 'Please enter a valid amount';
        if (!formData.claimDate) errors.claimDate = 'Incident date is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Sanitize payload
            const payload = {
                customerPolicyId: Number(formData.customerPolicyId),
                claimAmount: Number(formData.claimAmount),
                description: formData.description?.trim() || 'Claim Request'
            };
            await claimAPI.create(payload);
            setSuccess('Your claim has been submitted successfully and is now under review.');
            handleClose();
            // Refresh data to show new claim
            fetchMyClaims();
        } catch (err) {
            console.error('Error filing claim:', err);
            console.log('Error Details:', err.response?.data);

            let errorMsg = err.response?.data?.message || 'Failed to submit claim.';

            // Check for Spring Validation Errors
            if (err.response?.data?.errors) {
                const validations = err.response.data.errors;
                if (Array.isArray(validations)) {
                    errorMsg = validations.map(e => `${e.field}: ${e.defaultMessage}`).join(', ');
                } else {
                    errorMsg = JSON.stringify(validations);
                }
            } else if (err.response?.data?.error) {
                errorMsg += ` (${err.response.data.error})`;
            }

            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING': return { variant: 'warning', icon: 'bi-hourglass-split', label: 'Reviewing' };
            case 'APPROVED': return { variant: 'success', icon: 'bi-check-circle-fill', label: 'Approved' };
            case 'REJECTED': return { variant: 'danger', icon: 'bi-x-circle-fill', label: 'Declined' };
            default: return { variant: 'secondary', icon: 'bi-question-circle', label: status };
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <i className="bi bi-file-earmark-medical text-primary me-2"></i>
                        My Claims History
                    </h2>
                    <p className="text-muted mb-0">Track and manage your insurance benefit requests</p>
                </Col>
                <Col className="text-end">
                    {enrollments.length === 0 ? (
                        <div className="d-inline-block text-end">
                            <Button variant="secondary" disabled className="rounded-pill px-4 shadow-sm opacity-50" style={{ cursor: 'not-allowed' }}>
                                <i className="bi bi-lock-fill me-2"></i> File New Claim
                            </Button>
                            <div className="small text-danger mt-1 fw-bold">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                Active Policy Required
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleShowCreate}
                            className="rounded-pill px-4 shadow-sm"
                        >
                            <i className="bi bi-plus-lg me-2"></i> File New Claim
                        </Button>
                    )}
                </Col>
            </Row>

            <ErrorAlert message={error} onClose={() => setError('')} />
            <SuccessAlert message={success} onClose={() => setSuccess('')} />

            {/* Quick Stats Summary */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="opacity-75">Total Claims</small>
                                <h3 className="mb-0">{claims.length}</h3>
                            </div>
                            <i className="bi bi-list-ul fs-1 opacity-25"></i>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm bg-warning text-dark">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="opacity-75">Pending Review</small>
                                <h3 className="mb-0">{claims.filter(c => c.status === 'PENDING').length}</h3>
                            </div>
                            <i className="bi bi-clock-history fs-1 opacity-25"></i>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm bg-success text-white">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="opacity-75">Total Approved</small>
                                <h3 className="mb-0">{formatCurrency(claims.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + (c.claimAmount || 0), 0))}</h3>
                            </div>
                            <i className="bi bi-cash-stack fs-1 opacity-25"></i>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {claims.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-clipboard-x text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                            <h5 className="text-muted">No claims filed yet</h5>
                            <p className="small text-muted mb-0">When you file a claim, it will appear here for tracking.</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead className="bg-light">
                                <tr className="small text-uppercase text-muted">
                                    <th className="ps-4 py-3">Claim ID</th>
                                    <th className="py-3">Policy Info</th>
                                    <th className="py-3 text-center">Amount Requested</th>
                                    <th className="py-3">Date Filed</th>
                                    <th className="py-3 pe-4 text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map((claim) => {
                                    const status = getStatusInfo(claim.status);
                                    return (
                                        <tr key={claim.id} className="align-middle">
                                            <td className="ps-4">
                                                <Badge bg="light" text="dark" className="border">#{claim.id}</Badge>
                                            </td>
                                            <td>
                                                <div className="fw-bold small">Enrollment #{claim.enrollmentId}</div>
                                                <div className="text-muted extra-small">Policy Coverage ID: {claim.policyId || 'Active Plan'}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="fw-bold text-dark">{formatCurrency(claim.claimAmount)}</span>
                                            </td>
                                            <td>{formatDate(claim.claimDate)}</td>
                                            <td className="pe-4 text-end">
                                                <Badge bg={status.variant} className="px-3 py-2 rounded-pill fw-normal">
                                                    <i className={`bi ${status.icon} me-1`}></i>
                                                    {status.label}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* File Claim Modal */}
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">
                        <i className="bi bi-send-plus-fill text-primary me-2"></i>
                        New Benefit Claim
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={12} className="mb-4">
                                <Alert variant="light" className="border-start border-primary border-4 py-2 small">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Please ensure all details match your incident documents for faster processing.
                                </Alert>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="small fw-bold">Select Active Policy</Form.Label>
                                <Form.Select
                                    name="customerPolicyId"
                                    value={formData.customerPolicyId}
                                    onChange={handleChange}
                                    isInvalid={!!formErrors.customerPolicyId}
                                    className="py-2"
                                >
                                    <option value="">Choose one...</option>
                                    {enrollments.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            Policy ID: {e.policyId} (ID: #{e.id})
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{formErrors.customerPolicyId}</Form.Control.Feedback>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="small fw-bold">Requested Amount</Form.Label>
                                <div className="d-flex align-items-center">
                                    <span className="me-2 text-muted fw-bold">$</span>
                                    <Form.Control
                                        type="number"
                                        name="claimAmount"
                                        value={formData.claimAmount}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.claimAmount}
                                        placeholder="0.00"
                                        className="py-2"
                                    />
                                </div>
                                <Form.Control.Feedback type="invalid" className="d-block">{formErrors.claimAmount}</Form.Control.Feedback>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="small fw-bold">Date of Incident</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="claimDate"
                                    value={formData.claimDate}
                                    onChange={handleChange}
                                    isInvalid={!!formErrors.claimDate}
                                    className="py-2"
                                />
                                <Form.Control.Feedback type="invalid">{formErrors.claimDate}</Form.Control.Feedback>
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Label className="small fw-bold">Brief Description (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the nature of your claim..."
                                    className="bg-light border-0"
                                />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={handleClose} className="px-4 rounded-pill">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting} className="px-5 rounded-pill shadow">
                                {submitting ? (
                                    <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                                ) : 'Submit Claim Request'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default MyClaims;
