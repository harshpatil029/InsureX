import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { policyAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { formatCurrency } from '../utils/helpers';

const Policies = () => {
    const { hasRole } = useAuth();
    const canManage = hasRole('ROLE_ADMIN') || hasRole('ROLE_AGENT'); // Allow Agents to Manage

    // Alias canManage to isAdmin variable name used in render logic to avoid rewriting all render checks
    const isAdmin = canManage;

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentPolicy, setCurrentPolicy] = useState(null);
    const [formData, setFormData] = useState({
        policyName: '',
        policyDescription: '',
        coverageAmount: '',
        premiumAmount: '',
        durationInMonths: 12,
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await policyAPI.getAll();
            setPolicies(data);
        } catch (err) {
            console.error('Error fetching policies:', err);
            setError('Failed to load policies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleShowCreate = () => {
        setModalMode('create');
        setFormData({
            policyName: '',
            policyDescription: '',
            coverageAmount: '',
            premiumAmount: '',
            durationInMonths: 12,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleShowEdit = (policy) => {
        setModalMode('edit');
        setCurrentPolicy(policy);
        setFormData({
            policyName: policy.policyName,
            policyDescription: policy.policyDescription || '',
            coverageAmount: policy.coverageAmount,
            premiumAmount: policy.premiumAmount,
            durationInMonths: policy.durationInMonths || 12,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentPolicy(null);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.policyName || !formData.policyName.trim()) {
            errors.policyName = 'Policy name is required';
        }

        if (!formData.policyDescription || !formData.policyDescription.trim()) {
            errors.policyDescription = 'Description is required';
        }

        if (!formData.coverageAmount || formData.coverageAmount <= 0) {
            errors.coverageAmount = 'Coverage amount must be greater than 0';
        }

        if (!formData.premiumAmount || formData.premiumAmount <= 0) {
            errors.premiumAmount = 'Premium amount must be greater than 0';
        }

        if (!formData.durationInMonths || formData.durationInMonths <= 0) {
            errors.durationInMonths = 'Duration must be valid (months)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            if (modalMode === 'create') {
                await policyAPI.create(formData);
                setSuccess('Policy created successfully!');
            } else {
                await policyAPI.update(currentPolicy.id, formData);
                setSuccess('Policy updated successfully!');
            }

            handleClose();
            fetchPolicies();
        } catch (err) {
            console.error('Error saving policy:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            const errorDetail = JSON.stringify(err.response?.data || 'No detail');
            setError(`Failed to save policy: ${errorMsg}`);
            console.error(`Backend Error: ${errorMsg}\n\nDetail: ${errorDetail}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this policy?')) {
            return;
        }

        try {
            await policyAPI.delete(id);
            setSuccess('Policy deleted successfully!');
            fetchPolicies();
        } catch (err) {
            console.error('Error deleting policy:', err);
            const msg = err.response?.data?.message || 'Failed to delete policy.';
            console.error(msg);
            setError(msg);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <i className="bi bi-shield-lock text-primary me-2"></i>
                        Policy Management
                    </h2>
                    <p className="text-muted mb-0">Create and manage insurance products</p>
                </Col>
                <Col className="text-end">
                    {isAdmin && (
                        <Button variant="primary" onClick={handleShowCreate} className="shadow-sm px-4">
                            <i className="bi bi-plus-lg me-2"></i>
                            New Policy
                        </Button>
                    )}
                </Col>
            </Row>

            <ErrorAlert message={error} onClose={() => setError('')} />
            <SuccessAlert message={success} onClose={() => setSuccess('')} />

            <Card className="shadow-sm border-0 border-top border-primary border-4">
                <Card.Body className="p-0">
                    {policies.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '4rem' }}></i>
                            <p className="text-muted mt-3">No policies found. Create your first policy!</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Policy Name</th>
                                    <th>Duration</th>
                                    <th>Coverage</th>
                                    <th>Premium</th>
                                    <th className="text-end pe-4">{isAdmin ? 'Actions' : ''}</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {policies.map((policy) => (
                                    <tr key={policy.id} className="align-middle">
                                        <td className="ps-4 text-muted"><small>#{policy.id}</small></td>
                                        <td>
                                            <div className="fw-bold">{policy.policyName}</div>
                                            <small className="text-muted">{policy.policyDescription ? (policy.policyDescription.substring(0, 50) + '...') : 'No description'}</small>
                                        </td>
                                        <td>
                                            <Badge bg="info" className="px-3 py-2 fw-normal rounded-pill">
                                                {policy.durationInMonths} Mo
                                            </Badge>
                                        </td>
                                        <td className="text-success fw-semibold">
                                            {formatCurrency(policy.coverageAmount)}
                                        </td>
                                        <td className="text-primary fw-semibold">
                                            {formatCurrency(policy.premiumAmount)}
                                            <small className="text-muted ms-1">/mo</small>
                                        </td>
                                        <td className="text-end pe-4">
                                            {isAdmin && (
                                                <>
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="me-2 text-primary border shadow-sm"
                                                        onClick={() => handleShowEdit(policy)}
                                                        title="Edit Policy"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Button>
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="text-danger border shadow-sm"
                                                        onClick={() => handleDelete(policy.id)}
                                                        title="Delete Policy"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Create/Edit Modal - Only rendered if needed, though form protection is mostly UI level here */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <i className={`bi ${modalMode === 'create' ? 'bi-plus-circle' : 'bi-pencil-square'} me-2`}></i>
                        {modalMode === 'create' ? 'Create New Policy' : 'Edit Policy Details'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit} id="policyForm">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Policy Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="policyName"
                                        value={formData.policyName}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.policyName}
                                        placeholder="e.g. Platinum Health Plus"
                                        disabled={submitting}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.policyName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Duration (Months)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="durationInMonths"
                                        value={formData.durationInMonths}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.durationInMonths}
                                        autoFocus={false}
                                        disabled={submitting}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.durationInMonths}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Coverage Amount ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="coverageAmount"
                                        value={formData.coverageAmount}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.coverageAmount}
                                        placeholder="Total payout amount"
                                        disabled={submitting}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.coverageAmount}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Monthly Premium ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="premiumAmount"
                                        value={formData.premiumAmount}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.premiumAmount}
                                        placeholder="Monthly cost"
                                        disabled={submitting}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.premiumAmount}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-0">
                            <Form.Label className="fw-bold small">Policy Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="policyDescription"
                                value={formData.policyDescription}
                                onChange={handleChange}
                                isInvalid={!!formErrors.policyDescription}
                                placeholder="Specify coverage details, deductibles, etc."
                                disabled={submitting}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.policyDescription}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-light border-0">
                    <Button variant="outline-secondary" onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="px-4">
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Processing...
                            </>
                        ) : (
                            modalMode === 'create' ? 'Create Policy' : 'Save Changes'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Policies;
