import React from 'react';
import { Alert } from 'react-bootstrap';

const SuccessAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <Alert
            variant="success"
            dismissible
            onClose={onClose}
            className="border-0 shadow-sm"
            style={{
                backgroundColor: '#d1e7dd',
                borderLeft: '4px solid #198754'
            }}
        >
            <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                <span>{message}</span>
            </div>
        </Alert>
    );
};

export default SuccessAlert;
