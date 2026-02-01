# Quick Test Reference Card

## 🚀 Application Status
- **Frontend**: http://localhost:3000 ✅ RUNNING
- **Backend**: http://localhost:8080 ✅ RUNNING

---

## 🎯 Priority Tests (Start Here!)

### 1️⃣ **Test Registration Page** (2 minutes)
```
1. Open: http://localhost:3000/register
2. Look at "Role" dropdown
3. ✅ Should ONLY show: Customer, Agent
4. ❌ Should NOT show: Admin
5. ✅ Should see note: "Admin accounts can only be created..."
```

### 2️⃣ **Test Customer Login** (1 minute)
```
1. First register a customer if not done:
   - Go to /register
   - Fill form, select Customer role
   - Register

2. Login at /login
3. Check navbar ✅ Should show:
   - Dashboard
   - My Policies
   - My Claims
4. Check navbar ❌ Should NOT show:
   - User Management
   - Policies (admin only)
```

### 3️⃣ **Test Access Control** (1 minute)
```
1. While logged in as Customer
2. Try to visit: http://localhost:3000/admin-management
3. ✅ Should redirect to /unauthorized
4. ✅ Should show "You do not have permission..."
```

### 4️⃣ **Test Admin Login** (If backend has seeded admin)
```
1. Logout
2. Login with admin credentials (check your backend)
   Default usually: admin / Admin@123
3. Check navbar ✅ Should show:
   - Dashboard
   - Policies
   - Customers
   - Claims
   - User Management ← NEW!
```

### 5️⃣ **Test Admin Management Page** (2 minutes)
```
1. As admin, click "User Management"
2. ✅ Page loads with form
3. Fill form to create new admin:
   - Full Name: Test Admin
   - Username: testadmin
   - Email: test@admin.com
   - Password: TestPass123
   - Confirm: TestPass123
   - Role: Admin
4. Submit
5. ✅ Should show success message
6. ✅ Form should reset
```

---

## 📋 Quick Troubleshooting

### Backend Not Running?
```bash
cd InsuranceManagementSystem
./mvnw spring-boot:run
```

### Frontend Not Running?
```bash
cd insurance-frontend
npm start
```

### Cannot Login as Admin?
```
⚠️ IMPORTANT: Backend must seed first admin user!
Check backend console for default credentials
Or implement data seeder (see ADMIN_SETUP.md)
```

### Browser Shows Old Version?
```
1. Hard refresh: Ctrl + Shift + R
2. Clear cache: Ctrl + Shift + Delete
3. Restart browser
```

---

## ✅ Success Criteria

**Registration Page:**
- [ ] Only 2 roles in dropdown
- [ ] Help text visible
- [ ] Can register Customer
- [ ] Can register Agent

**Access Control:**
- [ ] Customer CANNOT access /admin-management
- [ ] Admin CAN access /admin-management
- [ ] Proper redirects work

**Admin Management:**
- [ ] Page loads for admins
- [ ] Can create admin users
- [ ] Can create agent users
- [ ] Form validation works

---

## 🎬 Test Sequence

**Option A: No Admin Yet** (Backend needs seeding)
```
1. Test registration page ✅
2. Register as Customer ✅
3. Login as Customer ✅
4. Test access control ✅
5. ⏸️ Wait for backend admin seed
```

**Option B: Admin Exists** (Full test)
```
1. Test registration page ✅
2. Register as Customer ✅
3. Login as Customer ✅
4. Test access control ✅
5. Logout ✅
6. Login as Admin ✅
7. Test admin management ✅
8. Create new admin ✅
9. Login with new admin ✅
```

---

## 📸 What to Check

### Registration Page
![Expected: Customer, Agent dropdown only]

### Admin Navbar
```
Dashboard | Policies | Customers | Claims | User Management
```

### Customer Navbar
```
Dashboard | My Policies | My Claims
```

### Admin Management Page
```
Title: "Admin User Management"
Form: Create new admin/agent
Sidebar: Notes and guidelines
```

---

## 🔥 Critical Tests

**MUST PASS:**
1. ✅ Admin role NOT in public registration
2. ✅ Customer CANNOT access admin routes
3. ✅ Admin CAN see "User Management" link
4. ✅ Admin CAN create new admin users

**NICE TO HAVE:**
1. ✅ Form validation works
2. ✅ Success messages show
3. ✅ Error handling works
4. ✅ Logout redirects properly

---

## 💡 Pro Tips

1. **Use different browsers** for different roles (e.g., Chrome for Customer, Firefox for Admin)
2. **Open DevTools (F12)** to see API calls and errors
3. **Check Console** for any JavaScript errors
4. **Check Network tab** for failed API calls
5. **Use Incognito/Private** mode to test fresh sessions

---

## 📞 Need Help?

See detailed guides:
- **TESTING_GUIDE.md** - Complete test suite
- **ADMIN_SETUP.md** - Backend setup
- **CHANGES_SUMMARY.md** - What changed

---

**Start Testing Now! 🚀**

Open http://localhost:3000 in your browser!
