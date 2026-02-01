import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Dropdown, ButtonGroup, Modal } from 'react-bootstrap';
import { claimAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { formatCurrency, formatDate } from '../utils/helpers';

const Claims = () => {
    const { hasRole } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await claimAPI.getAll();
            setClaims(data);
        } catch (err) {
            console.error('Error fetching claims:', err);
            setError('Failed to load claims database.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (claimId, newStatus) => {
        try {
            await claimAPI.updateStatus(claimId, newStatus);
            setSuccess(`Claim #${claimId} marked as ${newStatus.toLowerCase()}.`);
            setShowDetailModal(false);
            fetchClaims();
        } catch (err) {
            console.error('Error updating claim:', err);
            let detailedMsg = err.response?.data?.message || err.response?.data?.error || 'Update failed.';
            // Add full details for debugging 500s
            if (err.response?.data && typeof err.response.data === 'object') {
                detailedMsg += ` (${JSON.stringify(err.response.data)})`;
            }
            if (detailedMsg.includes('Access Denied')) {
                detailedMsg = 'Permission Error: You updated the permissions code, but the Backend Server is still running the old version. Please RESTART the Backend Server to apply changes.';
            }
            setError(detailedMsg);
        }
    };

    const handleShowDetail = (claim) => {
        setSelectedClaim(claim);
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        const variants = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'danger',
        };
        return (
            <Badge bg={variants[status] || 'secondary'} className="px-3 py-2 rounded-pill fw-normal">
                {status}
            </Badge>
        );
    };

    const filteredClaims = filter === 'ALL' ? claims : claims.filter(c => c.status === filter);

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <i className="bi bi-clipboard-pulse text-primary me-2"></i>
                        Claims Approval Center
                    </h2>
                    <p className="text-muted mb-0">Review and decision insurance benefit requests</p>
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                    <Dropdown as={ButtonGroup} onSelect={(k) => setFilter(k)}>
                        <Button variant="outline-primary" size="sm">
                            <i className="bi bi-funnel me-1"></i> Filter: {filter}
                        </Button>
                        <Dropdown.Toggle split variant="outline-primary" size="sm" />
                        <Dropdown.Menu align="end">
                            <Dropdown.Item eventKey="ALL">Show All</Dropdown.Item>
                            <Dropdown.Item eventKey="PENDING">Pending Only</Dropdown.Item>
                            <Dropdown.Item eventKey="APPROVED">Approved Only</Dropdown.Item>
                            <Dropdown.Item eventKey="REJECTED">Rejected Only</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="outline-secondary" size="sm" onClick={fetchClaims}>
                        <i className="bi bi-arrow-clockwise"></i>
                    </Button>
                </Col>
            </Row>

            {/* Alerts removed as per request */}

            {/* Admin/Agent Stats */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-top border-warning border-4 h-100">
                        <Card.Body>
                            <h6 className="text-muted small mb-1">Awaiting Review</h6>
                            <h3 className="mb-0 text-warning">{claims.filter(c => c.status === 'PENDING').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-top border-success border-4 h-100">
                        <Card.Body>
                            <h6 className="text-muted small mb-1">Approved Claims</h6>
                            <h3 className="mb-0 text-success">{claims.filter(c => c.status === 'APPROVED').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm border-0 border-top border-primary border-4 h-100 bg-light">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted small mb-1 text-uppercase">Total Exposure (Approved)</h6>
                                <h3 className="mb-0 text-primary">
                                    {formatCurrency(claims.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + (c.claimAmount || 0), 0))}
                                </h3>
                            </div>
                            <i className="bi bi-bank fs-1 text-primary opacity-25"></i>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {filteredClaims.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-journal-check text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                            <h5 className="text-muted">Queue is clear!</h5>
                            <p className="small text-muted mb-0">No claims matching your filter were found.</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted">
                                    <th className="ps-4 py-3">Claim Reference</th>

                                    <th className="py-3">Amount</th>
                                    <th className="py-3">Submission Date</th>
                                    <th className="py-3">Current Status</th>
                                    <th className="py-3 pe-4 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="align-middle">
                                        <td className="ps-4">
                                            <span className="fw-bold">CLM-{claim.id}</span>
                                        </td>

                                        <td>
                                            <span className="fw-bold fs-6">{formatCurrency(claim.claimAmount)}</span>
                                        </td>
                                        <td>{formatDate(claim.claimDate)}</td>
                                        <td>{getStatusBadge(claim.status)}</td>
                                        <td className="pe-4 text-end">
                                            <Button
                                                variant="light"
                                                size="sm"
                                                className="border text-primary fw-bold"
                                                onClick={() => handleShowDetail(claim)}
                                            >
                                                Review
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Claim Review Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="md">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Review Claim Reference CLM-{selectedClaim?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {selectedClaim && (
                        <div className="bg-light p-4 rounded mb-4">

                            <Row className="mb-3">
                                <Col xs={6} className="text-muted small">Incident Date:</Col>
                                <Col xs={6} className="text-end fw-bold">{formatDate(selectedClaim.claimDate)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} className="text-muted small">Requested Benefit:</Col>
                                <Col xs={6} className="text-end fw-bold text-dark fs-5">{formatCurrency(selectedClaim.claimAmount)}</Col>
                            </Row>
                            <hr />
                            <div className="small text-muted mb-2">Internal Note:</div>
                            <p className="text-dark small mb-0">
                                This claim was submitted via the customer portal. Please verify the enrollment status and mandatory cooling-off periods before approval.
                            </p>
                        </div>
                    )}

                    <div className="text-center text-muted extra-small mb-4">
                        <i className="bi bi-info-circle-fill me-1"></i>
                        Final decisions are recorded for audit purposes and cannot be reversed easily.
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center pb-4">
                    {selectedClaim?.status === 'PENDING' ? (
                        <>
                            <Button
                                variant="outline-danger"
                                className="px-4 rounded-pill"
                                onClick={() => handleStatusUpdate(selectedClaim.id, 'REJECTED')}
                            >
                                <i className="bi bi-x-lg me-1"></i> Decline
                            </Button>
                            <Button
                                variant="success"
                                className="px-4 rounded-pill shadow-sm"
                                onClick={() => handleStatusUpdate(selectedClaim.id, 'APPROVED')}
                            >
                                <i className="bi bi-check-lg me-1"></i> Approve Benefit
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" onClick={() => setShowDetailModal(false)} className="rounded-pill px-4">
                            Close Review
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Claims;
