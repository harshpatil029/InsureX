# CORS Fix Applied - Backend Restart Required

## ✅ What Was Fixed

**File Updated:** `SecurityConfiguration.java`

**Before:**
```java
configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
```

**After:**
```java
configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000", "http://localhost:5173"));
```

Also added `PATCH` to allowed methods for claim status updates.

---

## 🔄 **RESTART BACKEND NOW**

The backend MUST be restarted for CORS changes to take effect!

### Option 1: Using IDE (Recommended)
1. **Stop** the current backend process in your IDE
2. **Run** the application again

### Option 2: Using Terminal

**Step 1: Stop Current Backend**
```powershell
# Find Java process
Get-Process -Name "java"

# Stop it (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

**Step 2: Restart Backend**
```powershell
cd InsuranceManagementSystem
./mvnw spring-boot:run
```

**OR if using Maven wrapper:**
```powershell
cd InsuranceManagementSystem
mvn spring-boot:run
```

### Option 3: Kill Process by Port
```powershell
# Find process on port 8080
netstat -ano | findstr :8080

# Kill it (replace PID)
taskkill /PID <PID> /F

# Restart
cd InsuranceManagementSystem
./mvnw spring-boot:run
```

---

## ✅ Verify Backend Started

Look for this in the console:
```
Started InsuranceManagementSystemApplication in X.XXX seconds
```

Backend should be running on: **http://localhost:8080**

---

## 🧪 Test CORS Fix

After restarting backend:

1. **Go to:** http://localhost:3000/register
2. **Fill the form** and click Register
3. **Expected:** NO CORS error!
4. **Result:** Registration should work ✅

---

## 📊 What Changed

| Setting | Before | After |
|---------|--------|-------|
| Allowed Origins | Only port 5173 | Ports 3000 & 5173 |
| Allowed Methods | GET, POST, PUT, DELETE, OPTIONS | Added PATCH |
| Frontend Port | ❌ Blocked | ✅ Allowed |

---

## 🔍 Understanding CORS

**CORS** = Cross-Origin Resource Sharing

**Problem:**
- Frontend: http://localhost:3000 (React)
- Backend: http://localhost:8080 (Spring Boot)
- Different ports = Different origins
- Browser blocks cross-origin requests by default

**Solution:**
- Backend tells browser: "I trust requests from localhost:3000"
- Browser allows the requests
- ✅ Frontend can now talk to backend!

---

## ⚠️ Important Notes

1. **MUST RESTART BACKEND** - Changes won't work until restart
2. **Check port 8080** - Make sure backend restarts successfully
3. **Clear browser cache** - After backend restart, hard refresh browser (Ctrl+Shift+R)
4. **Check console** - Look for "Started InsuranceManagementSystemApplication"

---

## 🚦 Status Checklist

After restarting backend, verify:

- [ ] Backend console shows "Started InsuranceManagementSystemApplication"
- [ ] Backend accessible at http://localhost:8080
- [ ] No errors in backend console
- [ ] Frontend still running at http://localhost:3000
- [ ] Try registration - NO CORS error
- [ ] Registration succeeds ✅

---

## 💡 Next Steps

1. **Stop backend** (in your IDE or terminal)
2. **Restart backend** (it will recompile with new CORS config)
3. **Wait for "Started" message**
4. **Try registration again** at http://localhost:3000/register
5. **Should work!** ✅

---

**Status:** ✅ Fix applied, awaiting backend restart  
**Action Required:** Restart backend to apply CORS configuration
