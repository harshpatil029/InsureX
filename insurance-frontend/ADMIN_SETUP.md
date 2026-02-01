# Admin User Management - Implementation Notes

## Overview
Admin users can only be registered by existing administrators. Public registration is restricted to Customer and Agent roles only.

## Changes Made

### 1. Updated Registration Page (`Register.jsx`)
- **Removed**: Admin role option from public registration
- **Added**: Informational note explaining admin registration policy
- **Available Roles**: Only Customer and Agent

### 2. Created Admin Management Page (`AdminManagement.jsx`)
- **Purpose**: Allows admins to create new admin and agent users
- **Access**: Admin role only (ROLE_ADMIN)
- **Features**:
  - Create new admin users
  - Create new agent users
  - Form validation
  - Password confirmation
  - Helpful notes and guidelines

### 3. Updated Navigation (`Navbar.jsx`)
- **Added**: "User Management" menu item for admins
- **Route**: `/admin-management`
- **Visible**: Only to logged-in admin users

### 4. Updated Routing (`App.js`)
- **Added**: `/admin-management` protected route
- **Protection**: Requires ROLE_ADMIN

## Backend Requirements

### Initial Admin Account
The backend **must** seed/create the first admin account automatically during initialization.

**Recommended Implementation**:
```java
@Component
public class DataSeeder implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin if no admin exists
        if (userRepository.findByRole("ROLE_ADMIN").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setEmail("admin@insurex.com");
            admin.setFullName("System Administrator");
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            
            System.out.println("Default admin user created:");
            System.out.println("Username: admin");
            System.out.println("Password: Admin@123");
            System.out.println("IMPORTANT: Change this password immediately!");
        }
    }
}
```

## User Flow

### For Public Users (Registration)
1. Navigate to `/register`
2. Fill in registration form
3. Select role: Customer or Agent only
4. Admin option is not available
5. See note: "Admin accounts can only be created by existing administrators"

### For Admin Users (Creating New Admins)
1. Login as admin
2. Navigate to "User Management" in navbar
3. Fill in new admin/agent details
4. Select role (Admin or Agent)
5. Submit form
6. New user is created

## Default Admin Credentials

Since the first admin is created by the backend:

**Username**: `admin`  
**Password**: (As configured in backend seed data)  
**Email**: `admin@insurex.com`

⚠️ **Security Note**: Change the default admin password immediately after first login!

## API Endpoints Used

### Creating Admin Users
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "fullName": "string",
    "role": "ROLE_ADMIN" or "ROLE_AGENT"
  }
  ```
- **Authorization**: Requires admin privileges (enforce in backend)

## Security Considerations

1. **Backend Validation**: Backend must verify the requesting user has ROLE_ADMIN before creating admin users
2. **Strong Passwords**: Enforce password policies (min 6 characters currently, recommend 8+ with complexity)
3. **Audit Logging**: Log all admin user creation events
4. **Initial Setup**: First admin should change default credentials immediately
5. **Principle of Least Privilege**: Only create admin accounts when absolutely necessary

## Testing

### Test Scenario 1: Public Registration
1. Go to `/register`
2. Verify only Customer and Agent roles are available
3. Try to register as Customer - should succeed
4. Try to register as Agent - should succeed

### Test Scenario 2: Admin Creation (Positive)
1. Login as admin (using seeded credentials)
2. Navigate to `/admin-management`
3. Fill form with new admin details
4. Submit - should create new admin successfully

### Test Scenario 3: Non-Admin Access (Negative)
1. Login as Customer or Agent
2. Try to access `/admin-management`
3. Should redirect to `/unauthorized`
4. "User Management" link should not appear in navbar

## Frontend File Changes

```
Modified:
  - src/pages/Register.jsx (removed ROLE_ADMIN option)
  - src/components/Navbar.jsx (added User Management link)
  - src/App.js (added admin-management route)

Created:
  - src/pages/AdminManagement.jsx (new admin user creation page)
  - ADMIN_SETUP.md (this documentation)
```

## UI Screenshots

### Public Registration
- Role dropdown shows: Customer, Agent
- Help text: "Admin accounts can only be created by existing administrators"

### Admin Management Page
- Form to create new admin/agent users
- Role selection: Admin, Agent
- Informational sidebar with guidelines
- Default admin credentials reminder

## Future Enhancements

1. **Email Verification**: Send email with temporary password to new admins
2. **Force Password Change**: Require password change on first login
3. **Two-Factor Authentication**: Add 2FA for admin accounts
4. **Admin List**: Display all existing admin users
5. **Deactivate Users**: Ability to disable admin accounts
6. **Audit Trail**: Show history of admin user actions
7. **Role Permissions**: Fine-grained permissions within admin role

## Support

For backend implementation assistance, please refer to:
- Spring Security documentation
- User repository implementation
- Password encoder configuration
- Data seeding strategies

---

**Implementation Date**: 2026-02-01  
**Status**: ✅ Complete  
**Tested**: ✅ Pending backend seed implementation
