import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <Container className="mt-5">
            <Card className="text-center shadow">
                <Card.Body className="p-5">
                    <div className="display-1 text-danger mb-4">🚫</div>
                    <h2 className="mb-3">Access Denied</h2>
                    <p className="text-muted mb-4">
                        You don't have permission to access this page.
                        Please contact your administrator if you believe this is an error.
                    </p>
                    <Button as={Link} to="/dashboard" variant="primary">
                        Return to Dashboard
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Unauthorized;
