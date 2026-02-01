USE Insurance;

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@insurex.com';

-- Create admin user with BCrypt hashed password for 'password123'
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', 'admin@insurex.com', 'ROLE_ADMIN');

SELECT 'Admin user created successfully!' as message;
SELECT id, username, email, role FROM users WHERE role = 'ROLE_ADMIN';
