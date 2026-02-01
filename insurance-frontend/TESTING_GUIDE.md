# InsureX Frontend Testing Guide

## ✅ Testing Checklist - Admin Registration Policy

### Prerequisites
- ✅ Frontend running at: http://localhost:3000
- ✅ Backend running at: http://localhost:8080
- ⚠️ Backend must have seeded first admin user

---

## 🧪 Test Suite 1: Public Registration (Admin Role Removed)

### Test 1.1: Verify Admin Role is NOT Available
**Steps:**
1. Open browser and navigate to: `http://localhost:3000`
2. Click "Register" button in the navbar (or navigate to `/register`)
3. Look at the "Role" dropdown field

**Expected Result:**
- ✅ Dropdown shows only TWO options:
  - Customer
  - Agent
- ✅ Admin option is NOT present
- ✅ Help text displays: "Note: Admin accounts can only be created by existing administrators."

**Screenshot Checkpoint:** Registration page showing only Customer and Agent roles

---

### Test 1.2: Register as Customer
**Steps:**
1. Fill in the registration form:
   - Full Name: `Test Customer`
   - Username: `testcustomer`
   - Email: `customer@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Role: Select `Customer`
2. Click "Register" button

**Expected Result:**
- ✅ Success message appears
- ✅ Redirects to login page after 2 seconds
- ✅ No errors displayed

---

### Test 1.3: Register as Agent
**Steps:**
1. Navigate back to `/register`
2. Fill in the registration form:
   - Full Name: `Test Agent`
   - Username: `testagent`
   - Email: `agent@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Role: Select `Agent`
3. Click "Register" button

**Expected Result:**
- ✅ Success message appears
- ✅ Redirects to login page
- ✅ No errors displayed

---

## 🧪 Test Suite 2: Login Functionality

### Test 2.1: Login as Customer
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Username: `testcustomer`
   - Password: `password123`
3. Click "Login" button

**Expected Result:**
- ✅ Successfully logs in
- ✅ Redirects to `/dashboard`
- ✅ Navbar shows:
   - "Dashboard"
   - "My Policies"
   - "My Claims"
   - "Welcome, testcustomer"
   - "Logout" button
- ✅ NO "User Management" link visible
- ✅ NO "Policies", "Customers", or "Claims" admin links

---

### Test 2.2: Verify Customer Cannot Access Admin Routes
**Steps:**
1. While logged in as customer, manually navigate to: `http://localhost:3000/admin-management`

**Expected Result:**
- ✅ Redirects to `/unauthorized`
- ✅ Shows "Unauthorized Access" page
- ✅ Message: "You do not have permission to access this page"

**Also Test These URLs:**
- `/policies` → Should redirect to `/unauthorized`
- `/customers` → Should redirect to `/unauthorized`

---

### Test 2.3: Logout
**Steps:**
1. Click "Logout" button in navbar

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Navbar now shows "Login" and "Register" links
- ✅ Cannot access protected routes anymore

---

## 🧪 Test Suite 3: Admin Login (If Backend Has Seeded Admin)

### Test 3.1: Login as Admin
**Steps:**
1. Navigate to `/login`
2. Enter admin credentials (from backend seed):
   - Username: `admin` (or your backend's default)
   - Password: (your backend's seeded password)
3. Click "Login" button

**Expected Result:**
- ✅ Successfully logs in
- ✅ Redirects to `/dashboard`
- ✅ Navbar shows:
   - "Dashboard"
   - "Policies"
   - "Customers"
   - "Claims"
   - **"User Management"** ← NEW!
   - "Welcome, admin"
   - "Logout" button
- ✅ NO customer links (My Policies, My Claims)

---

### Test 3.2: Access Admin Management Page
**Steps:**
1. While logged in as admin, click "User Management" in navbar
2. OR navigate to: `http://localhost:3000/admin-management`

**Expected Result:**
- ✅ Page loads successfully
- ✅ Page title: "Admin User Management"
- ✅ Subtitle: "Create new administrator accounts"
- ✅ Form visible with fields:
   - Full Name
   - Username
   - Email
   - Password
   - Confirm Password
   - Role (dropdown with Admin and Agent)
- ✅ Right sidebar shows:
   - "Important Notes"
   - "Default Admin Credentials"

**Screenshot Checkpoint:** Admin Management page fully loaded

---

### Test 3.3: Create New Admin User
**Steps:**
1. On Admin Management page, fill in the form:
   - Full Name: `Second Admin`
   - Username: `admin2`
   - Email: `admin2@insurex.com`
   - Password: `AdminPass123`
   - Confirm Password: `AdminPass123`
   - Role: Select `Admin`
2. Click "Create Admin User" button

**Expected Result:**
- ✅ Success message: "Admin user created successfully!"
- ✅ Form resets to empty
- ✅ No errors displayed
- ✅ Can see loading spinner briefly during submission

---

### Test 3.4: Verify New Admin Can Login
**Steps:**
1. Logout from current admin session
2. Navigate to `/login`
3. Enter new admin credentials:
   - Username: `admin2`
   - Password: `AdminPass123`
4. Click "Login" button

**Expected Result:**
- ✅ Successfully logs in
- ✅ Has same admin menu items
- ✅ Can access "User Management"
- ✅ Can create other admin users

---

### Test 3.5: Create Agent User (Admin Creating Agent)
**Steps:**
1. Login as admin
2. Navigate to "User Management"
3. Fill in the form:
   - Full Name: `Test Agent 2`
   - Username: `testagent2`
   - Email: `agent2@insurex.com`
   - Password: `AgentPass123`
   - Confirm Password: `AgentPass123`
   - Role: Select `Agent`
4. Click "Create Admin User" button

**Expected Result:**
- ✅ Success message appears
- ✅ Agent user created
- ✅ Form resets

---

### Test 3.6: Verify Agent Can Login
**Steps:**
1. Logout
2. Login with agent credentials:
   - Username: `testagent2`
   - Password: `AgentPass123`

**Expected Result:**
- ✅ Successfully logs in
- ✅ Navbar shows:
   - Dashboard
   - Customers (agent can view)
   - Claims (agent can manage)
- ✅ NO "User Management" link
- ✅ NO "Policies" link (admin only)

---

## 🧪 Test Suite 4: Form Validation

### Test 4.1: Public Registration Validation
**Steps:**
1. Navigate to `/register`
2. Try to submit empty form
3. Try invalid email format
4. Try password mismatch
5. Try username less than 3 characters

**Expected Result:**
- ✅ All fields show appropriate error messages
- ✅ Form does not submit until valid
- ✅ Errors clear when field is corrected

---

### Test 4.2: Admin Creation Validation
**Steps:**
1. Login as admin
2. Navigate to "User Management"
3. Try empty form
4. Try password mismatch
5. Try invalid email

**Expected Result:**
- ✅ Validation errors shown
- ✅ Cannot submit invalid form
- ✅ Real-time validation feedback

---

## 🧪 Test Suite 5: Edge Cases

### Test 5.1: Duplicate Username
**Steps:**
1. Try to register with existing username

**Expected Result:**
- ✅ Backend returns error
- ✅ Error message displayed to user

---

### Test 5.2: Expired Token
**Steps:**
1. Login
2. Wait for token to expire (or manually delete token from localStorage)
3. Try to access protected route

**Expected Result:**
- ✅ Redirects to login
- ✅ Shows error message (optional)

---

### Test 5.3: Direct URL Access (Not Logged In)
**Steps:**
1. Ensure logged out
2. Navigate directly to: `http://localhost:3000/admin-management`

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Cannot access protected routes

---

## 📊 Test Results Template

```
=== INSUREX FRONTEND TESTING RESULTS ===
Date: 2026-02-01
Tester: [Your Name]

[ ] Test Suite 1: Public Registration
    [ ] 1.1: Admin role removed ✅/❌
    [ ] 1.2: Customer registration ✅/❌
    [ ] 1.3: Agent registration ✅/❌

[ ] Test Suite 2: Login Functionality
    [ ] 2.1: Customer login ✅/❌
    [ ] 2.2: Access control ✅/❌
    [ ] 2.3: Logout ✅/❌

[ ] Test Suite 3: Admin Functionality
    [ ] 3.1: Admin login ✅/❌
    [ ] 3.2: Admin management access ✅/❌
    [ ] 3.3: Create admin user ✅/❌
    [ ] 3.4: New admin login ✅/❌
    [ ] 3.5: Create agent user ✅/❌
    [ ] 3.6: Agent login ✅/❌

[ ] Test Suite 4: Form Validation
    [ ] 4.1: Registration validation ✅/❌
    [ ] 4.2: Admin creation validation ✅/❌

[ ] Test Suite 5: Edge Cases
    [ ] 5.1: Duplicate username ✅/❌
    [ ] 5.2: Expired token ✅/❌
    [ ] 5.3: Direct URL access ✅/❌

OVERALL STATUS: ✅ PASS / ❌ FAIL
Notes: [Add any issues or observations]
```

---

## 🔍 Browser DevTools Debugging

### Check Console (F12)
- No JavaScript errors
- API calls successful (200 status)
- JWT token stored in localStorage

### Check Network Tab
- POST /auth/register → 200/201
- POST /auth/login → 200
- GET requests with Authorization header

### Check Application Tab → Local Storage
```
Key: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (JWT token)
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Backend not responding"
**Solution:** 
```bash
cd InsuranceManagementSystem
./mvnw spring-boot:run
```

### Issue: "Customer profile not found"
**Solution:** Backend should auto-create customer profile on registration

### Issue: "Cannot access admin routes"
**Solution:** Verify JWT token has correct role claim

### Issue: Admin role visible in registration
**Solution:** Clear browser cache, refresh page

---

## 📸 Screenshots to Take

1. Registration page (showing only Customer/Agent roles)
2. Admin Management page (full form view)
3. Admin navbar (showing User Management link)
4. Customer navbar (NOT showing User Management)
5. Unauthorized page (when customer tries admin route)

---

## ✅ Final Verification Checklist

- [ ] Frontend compiling without errors
- [ ] Backend running on port 8080
- [ ] Can access http://localhost:3000
- [ ] Registration page loads
- [ ] Admin role NOT in dropdown
- [ ] Help text visible
- [ ] Can register as Customer
- [ ] Can register as Agent
- [ ] Can login successfully
- [ ] Role-based menus work
- [ ] Admin can access User Management
- [ ] Customer cannot access User Management
- [ ] Can create admin users (if logged in as admin)
- [ ] Form validation works
- [ ] Success/error messages display

---

**Happy Testing! 🚀**

If any test fails, note the details and we can troubleshoot together.
