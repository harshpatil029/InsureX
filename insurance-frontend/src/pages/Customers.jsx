import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { customerAPI, policyAPI, customerPolicyAPI } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { formatDate } from '../utils/helpers';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await customerAPI.getAll();
            setCustomers(data);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleShowEdit = (customer) => {
        setCurrentCustomer(customer);
        setFormData({
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email || '',
            phone: customer.phone || customer.phoneNumber || '',
            address: customer.address || '',
            dateOfBirth: customer.dateOfBirth || '',
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentCustomer(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth
            };
            await customerAPI.update(currentCustomer.id, payload);
            setSuccess('Customer profile updated successfully!');
            handleClose();
            fetchCustomers();
        } catch (err) {
            console.error('Error updating customer:', err);
            setError(err.response?.data?.message || 'Failed to update customer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('handleDelete triggered for ID:', id); // Debug log
        // window.confirm removed for testing

        try {
            console.log('Sending update request...');
            // Use UPDATE endpoint to trigger Soft Delete (Alternative Method)
            await customerAPI.update(id, { deleted: true });
            console.log('Update success!');
            window.location.reload(); // BRUTAL REFRESH to ensure UI sync
        } catch (err) {
            console.error('Delete/Update Error Full Object:', err);
            console.error('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const [policies, setPolicies] = useState([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState('');

    const handleShowEnroll = async (customer) => {
        setCurrentCustomer(customer);
        setSelectedPolicyId('');
        setError('');
        try {
            const data = await policyAPI.getAll();
            setPolicies(data);
            setShowEnrollModal(true);
        } catch (err) {
            console.error(err);
            setError('Failed to load policies for enrollment.');
        }
    };

    const handleEnrollSubmit = async () => {
        if (!selectedPolicyId) return;
        setSubmitting(true);
        try {
            await customerPolicyAPI.enroll({
                customerId: currentCustomer.id,
                policyId: selectedPolicyId
            });
            setSuccess(`Successfully enrolled ${currentCustomer.firstName} in policy!`);
            setShowEnrollModal(false);
        } catch (err) {
            console.error(err);
            setError('Enrollment failed. ' + (err.response?.data?.message || ''));
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container className="mt-4 pb-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <i className="bi bi-people-fill text-primary me-2"></i>
                        Customer Directory
                    </h2>
                    <p className="text-muted mb-0">View and manage all registered insurance holders</p>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-primary" size="sm" onClick={fetchCustomers} className="rounded-pill shadow-sm">
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh List
                    </Button>
                </Col>
            </Row>



            <Card className="shadow-sm border-0 border-top border-primary border-4">
                <Card.Body className="p-0">
                    {customers.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-person-exclamation text-muted" style={{ fontSize: '4rem' }}></i>
                            <p className="text-muted mt-3">No customer records found in the system.</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Record ID</th>

                                    <th>Name & Email</th>
                                    <th>Contact Information</th>
                                    <th>Address</th>
                                    <th>Date of Birth</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="align-middle">
                                        <td className="ps-4">
                                            <Badge bg="light" text="dark" className="border">
                                                ID: {customer.id}
                                            </Badge>
                                        </td>

                                        <td>
                                            <div className="fw-bold">{customer.firstName} {customer.lastName}</div>
                                            <div className="small text-muted">{customer.email}</div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-telephone text-primary me-2"></i>
                                                <span>{customer.phone || customer.phoneNumber || <span className="text-muted italic small">No phone</span>}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-start">
                                                <i className="bi bi-geo-alt text-muted me-2 pt-1"></i>
                                                <small className="text-wrap" style={{ maxWidth: '200px' }}>
                                                    {customer.address || <span className="text-muted italic">No address provided</span>}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <i className="bi bi-calendar-event me-2 text-muted"></i>
                                                {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : <span className="text-muted italic">Not set</span>}
                                            </div>
                                        </td>
                                        <td className="text-end pe-4">
                                            <Button
                                                variant="light"
                                                size="sm"
                                                className="me-2 text-success border"
                                                onClick={() => handleShowEnroll(customer)}
                                                title="Enroll in Policy"
                                            >
                                                <i className="bi bi-shield-plus"></i>
                                            </Button>
                                            <Button
                                                variant="light"
                                                size="sm"
                                                className="me-2 text-primary border"
                                                onClick={() => handleShowEdit(customer)}
                                                title="Edit Details"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                            <Button
                                                variant="light"
                                                size="sm"
                                                className="text-danger border"
                                                onClick={() => handleDelete(customer.id)}
                                                title="Delete Record"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="bg-primary text-white border-0">
                    <Modal.Title>
                        <i className="bi bi-person-gear me-2"></i>
                        Update Customer Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        disabled={submitting}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        disabled={submitting}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Email Address</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    disabled={submitting}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Phone Number</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    disabled={submitting}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Street Address</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-geo"></i></span>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full residential address"
                                    disabled={submitting}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-0">
                            <Form.Label className="small fw-bold">Date of Birth</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-calendar3"></i></span>
                                <Form.Control
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light p-3">
                    <Button variant="outline-secondary" onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="px-4 shadow-sm">
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Profile'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Enroll Modal */}
            <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title><i className="bi bi-shield-plus me-2"></i>Enroll Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select a policy for <strong>{currentCustomer?.firstName} {currentCustomer?.lastName}</strong>:</p>
                    <Form.Select
                        value={selectedPolicyId}
                        onChange={(e) => setSelectedPolicyId(e.target.value)}
                        disabled={submitting}
                    >
                        <option value="">-- Choose Policy --</option>
                        {policies.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.policyName} ({p.policyType}) - ${p.premiumAmount}/mo
                            </option>
                        ))}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleEnrollSubmit} disabled={!selectedPolicyId || submitting}>
                        {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default Customers;
