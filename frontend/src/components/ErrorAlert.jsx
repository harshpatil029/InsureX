import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <Alert
            variant="warning"
            dismissible
            onClose={onClose}
            className="border-0 shadow-sm"
            style={{
                backgroundColor: '#fff3cd',
                borderLeft: '4px solid #ffc107'
            }}
        >
            <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                <span>{message}</span>
            </div>
        </Alert>
    );
};

export default ErrorAlert;
