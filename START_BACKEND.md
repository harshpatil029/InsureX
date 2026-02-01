# 🚀 Starting the Backend - Quick Guide

## ⚠️ Current Issue
**Error:** `ERR_CONNECTION_REFUSED`
**Cause:** Backend is NOT running on port 8080

---

## 📋 How to Start the Backend

### ✅ **Option 1: Using Your IDE (RECOMMENDED)**

#### **IntelliJ IDEA:**
1. Open project: `InsureX/InsuranceManagementSystem`
2. Find the main class: `InsuranceManagementSystemApplication.java`
   - Location: `src/main/java/com/insurance/management/`
3. Right-click on the file
4. Select **"Run 'InsuranceManagementSystemApplication'"**
5. Wait for console message: `Started InsuranceManagementSystemApplication`

#### **Eclipse:**
1. Open project: `InsuranceManagementSystem`
2. Find: `InsuranceManagementSystemApplication.java`
3. Right-click → **Run As** → **Java Application**
4. Wait for "Started" message in console

#### **VS Code:**
1. Open folder: `InsuranceManagementSystem`
2. Install "Spring Boot Extension Pack" if not installed
3. Press `F5` or click Run button
4. Select "Java" when prompted

---

### ⚙️ **Option 2: Using Command Line**

**IF Maven is installed:**
```powershell
cd InsuranceManagementSystem
mvn spring-boot:run
```

**IF you have Maven wrapper:**
```powershell
cd InsuranceManagementSystem
./mvnw spring-boot:run          # Linux/Mac
.\mvnw.cmd spring-boot:run      # Windows
```

**Build and run JAR:**
```powershell
cd InsuranceManagementSystem
mvn clean package
java -jar target/insurance-management-system-0.0.1-SNAPSHOT.jar
```

---

## ✅ **Verify Backend is Running**

### Check 1: Console Message
Look for this in your console:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (vX.X.X)

...
Started InsuranceManagementSystemApplication in X.XXX seconds
```

### Check 2: Port 8080 Active
Open new PowerShell and run:
```powershell
netstat -ano | findstr :8080
```
Should show something like:
```
TCP    0.0.0.0:8080     0.0.0.0:0     LISTENING     12345
```

### Check 3: Browser Test
Open browser: http://localhost:8080/actuator/health
Should show:
```json
{"status":"UP"}
```

---

## 🎯 **After Backend Starts**

1. ✅ Wait for "Started InsuranceManagementSystemApplication" message
2. ✅ Verify port 8080 is listening
3. ✅ Go back to frontend: http://localhost:3000/register
4. ✅ Try registration again
5. ✅ Should work! No more connection refused error!

---

## 🐛 **Troubleshooting**

### "Port 8080 already in use"
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Try starting backend again
```

### "Maven not found"
**Solution:** Use your IDE to run the application (Option 1 above)

### "Java not found"
**Solution:** 
1. Install JDK 17 or higher
2. Set JAVA_HOME environment variable
3. Add Java to PATH

### "Database connection error"
**Solution:**
1. Make sure MySQL is running
2. Check `application.properties` for correct credentials
3. Ensure database `insurance_db` exists

---

## 📊 **Status Checklist**

Before testing registration:

- [ ] Backend started successfully
- [ ] Console shows "Started InsuranceManagementSystemApplication"
- [ ] Port 8080 is listening
- [ ] http://localhost:8080/actuator/health shows {"status":"UP"}
- [ ] Frontend running at http://localhost:3000
- [ ] No errors in backend console

---

## 🎬 **Quick Start Steps**

**Fastest way for most users:**

1. **Open IntelliJ/Eclipse**
2. **Open project:** `InsuranceManagementSystem`
3. **Find:** `InsuranceManagementSystemApplication.java`
4. **Right-click** → **Run**
5. **Wait** for "Started" message
6. **Test:** http://localhost:8080
7. **Go to frontend:** http://localhost:3000/register
8. **Try registration** - Should work! ✅

---

## 💡 **What's Happening**

```
Frontend (React)          Backend (Spring Boot)
http://localhost:3000  →  http://localhost:8080
     ✅ RUNNING              ❌ NOT RUNNING
                                ↓
                           START BACKEND
                                ↓
     ✅ RUNNING              ✅ RUNNING
                                ↓
                        Registration works! 🎉
```

---

## 📝 **Remember**

- **Frontend** is already running ✅
- **Backend** needs to be started ⏳
- **CORS** is already fixed in code ✅
- Once backend starts, registration will work! 🎉

---

**Start the backend now using your preferred method above!**
