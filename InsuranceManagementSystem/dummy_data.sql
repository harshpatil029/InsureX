-- Select the database
USE Insurance;

-- Disable foreign key checks to avoid issues during insertion
SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing data
TRUNCATE TABLE claims;
TRUNCATE TABLE customer_policies;
TRUNCATE TABLE payments;
TRUNCATE TABLE documents;
TRUNCATE TABLE customers;
TRUNCATE TABLE policies;
TRUNCATE TABLE users;

-- 1. Insert Users (Passwords are BCrypt hashed for 'password123')
INSERT INTO users (id, username, password, email, role) VALUES 
(1, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', 'admin@insurex.com', 'ROLE_ADMIN'),
(2, 'agent_yash', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', 'agent@insurex.com', 'ROLE_AGENT'),
(3, 'customer_shubh', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', 'customer@insurex.com', 'ROLE_CUSTOMER');

-- 2. Insert Customers
INSERT INTO customers (id, first_name, last_name, email, phone, address, date_of_birth, user_id) VALUES 
(1, 'Shubh', 'Gupta', 'customer@insurex.com', '9876543210', '123, MG Road, Mumbai', '1995-05-20', 3);

-- 3. Insert Policies
INSERT INTO policies (id, policy_name, policy_description, coverage_amount, premium_amount, duration_in_months) VALUES 
(1, 'Health Plus', 'Comprehensive health coverage for family', 500000.00, 12000.00, 12),
(2, 'Term Life Gold', 'Simple term life insurance with high coverage', 10000000.00, 8000.00, 12),
(3, 'Car Secure', 'Bumper to bumper car insurance', 400000.00, 5000.00, 12);

-- 4. Insert Customer Policies (Enrollments)
-- Note: PolicyStatus must be ACTIVE, EXPIRED, or CANCELLED
INSERT INTO customer_policies (id, customer_id, policy_id, start_date, end_date, status) VALUES 
(1, 1, 1, '2024-01-01', '2025-01-01', 'ACTIVE'),
(2, 1, 3, '2024-02-15', '2025-02-15', 'ACTIVE');

-- 5. Insert Claims
-- Note: ClaimStatus must be PENDING, APPROVED, or REJECTED
INSERT INTO claims (id, customer_policy_id, claim_amount, description, claim_date, status) VALUES 
(1, 1, 15000.00, 'Hospitalization for viral fever', '2024-03-10', 'APPROVED'),
(2, 1, 50000.00, 'Surgical procedure', '2024-06-20', 'PENDING');

-- 6. Insert Payments
-- Note: PaymentStatus must be SUCCESS, FAILED, or PENDING
INSERT INTO payments (id, customer_policy_id, amount, payment_date, transaction_id, status) VALUES 
(1, 1, 12000.00, '2024-01-01 10:30:00', 'TXN_998877', 'SUCCESS'),
(2, 2, 5000.00, '2024-02-15 14:20:00', 'TXN_665544', 'PENDING');

-- 7. Insert Documents
INSERT INTO documents (id, file_name, file_type, file_path, customer_id, claim_id) VALUES 
(1, 'Aadhar_Card.pdf', 'application/pdf', '/uploads/docs/customer_1_aadhar.pdf', 1, NULL),
(2, 'Medical_Report.jpg', 'image/jpeg', '/uploads/docs/claim_1_report.jpg', 1, 1);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
