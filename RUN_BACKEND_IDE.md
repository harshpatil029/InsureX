# 🚀 Running Backend in IDE - Complete Guide

## ✅ Main Class Information

**Correct Main Class:** `com.insurance.management.InsuranceApplication`
**Package:** `com.insurance.management`
**File:** `InsuranceApplication.java`

---

## 📋 Step-by-Step: Run in Your IDE

### **Option 1: IntelliJ IDEA** ⭐ RECOMMENDED

#### **Method A: Right-Click Run**
1. **Open Project:**
   - File → Open → Select `InsuranceManagementSystem` folder
   - Click "Trust Project" if prompted

2. **Wait for Indexing:**
   - Bottom right → Wait for "Indexing..." to complete
   - May take 1-2 minutes for first time

3. **Configure Lombok** (Important!):
   - File → Settings → Plugins
   - Search "Lombok"
   - Install if not installed
   - Enable Annotation Processing:
     - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
     - Check "Enable annotation processing"

4. **Run Application:**
   - Navigate to: `src/main/java/com/insurance/management/InsuranceApplication.java`
   - Right-click on the file
   - Select "Run 'InsuranceApplication.main()'"

5. **Wait for Startup:**
   - Check console for: `Started InsuranceApplication in X.XXX seconds`

#### **Method B: Run Configuration**
1. **Create Run Configuration:**
   - Run → Edit Configurations
   - Click "+" → Application
   - Name: "Insurance Backend"
   - Main class: `com.insurance.management.InsuranceApplication`
   - JRE: 17 or higher
   - Click "OK"

2. **Run:**
   - Click the green play button
   - Or: Run → Run 'Insurance Backend'

---

### **Option 2: Eclipse**

1. **Import Project:**
   - File → Import → Existing Maven Projects
   - Browse to `InsuranceManagementSystem` folder
   - Click "Finish"

2. **Wait for Maven:**
   - Let Eclipse download dependencies
   - Check bottom right for progress

3. **Install Lombok:**
   - Download lombok.jar
   - Run: `java -jar lombok.jar`
   - Select your Eclipse installation
   - Click "Install/Update"
   - Restart Eclipse

4. **Run Application:**
   - Navigate to `InsuranceApplication.java`
   - Right-click → Run As → Java Application

---

### **Option 3: VS Code**

1. **Install Extensions:**
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support

2. **Open Folder:**
   - File → Open Folder
   - Select `InsuranceManagementSystem`

3. **Wait for Java Extension:**
   - Bottom right → Wait for "Configuring Java..."

4. **Run:**
   - Open `InsuranceApplication.java`
   - Click "Run" button above main method
   - Or: F5 → Select "Java"

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Lombok methods not found"
**Solution:**
```
1. Install Lombok plugin in IDE
2. Enable annotation processing
3. Clean and rebuild project
```

### Issue 2: "Cannot resolve dependencies"
**IntelliJ:**
```
1. Right-click pom.xml
2. Maven → Reload Project
3. Wait for download to complete
```

**Eclipse:**
```
1. Right-click project
2. Maven → Update Project
3. Check "Force Update of Snapshots/Releases"
4. Click OK
```

### Issue 3: "Port 8080 already in use"
**Solution:**
```powershell
# Find process on port 8080
netstat -ano | findstr :8080

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Issue 4: "Database connection failed"
**Solution:**
1. Start MySQL
2. Create database:
   ```sql
   CREATE DATABASE IF NOT EXISTS insurance_db;
   ```
3. Check credentials in `application.properties`

---

## 🔧 Clean Build (If Compilation Errors)

### **IntelliJ:**
```
1. Build → Clean Project
2. Build → Rebuild Project
3. Wait for completion
4. Try running again
```

### **Eclipse:**
```
1. Project → Clean...
2. Select your project
3. Click "Clean"
4. Project → Build Project
```

### **VS Code:**
```
1. Ctrl+Shift+P
2. Type "Java: Clean Java Language Server Workspace"
3. Select and confirm
4. Reload VS Code
```

---

## ✅ Verify Backend is Running

### Check 1: Console Output
Look for this in your IDE console:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::

...
Started InsuranceApplication in 5.432 seconds (JVM running for 6.123)
```

### Check 2: Port Test
```powershell
netstat -ano | findstr :8080
```
Should show: `LISTENING`

### Check 3: Browser Test
```
http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

---

## 📊 Project Requirements

| Requirement | Version | Required? |
|-------------|---------|-----------|
| **JDK** | 17+ | ✅ Yes |
| **MySQL** | 8.0+ | ✅ Yes |
| **Maven** | Any | ⚠️ IDE handles it |
| **Lombok** | Latest | ✅ Yes (IDE plugin) |

---

## 🎯 Quick Start Checklist

**Before running:**
- [ ] JDK 17+ installed
- [ ] MySQL running
- [ ] Database `insurance_db` created
- [ ] IDE has Lombok plugin
- [ ] Annotation processing enabled (IntelliJ)
- [ ] Maven dependencies downloaded

**To run:**
- [ ] Open project in IDE
- [ ] Wait for indexing
- [ ] Find `InsuranceApplication.java`
- [ ] Right-click → Run
- [ ] Wait for "Started" message

**Verify:**
- [ ] Console shows "Started InsuranceApplication"
- [ ] Port 8080 is listening
- [ ] http://localhost:8080 accessible
- [ ] No errors in console

---

## 💾 application.properties

**Location:** `src/main/resources/application.properties`

**Check these settings:**
```properties
# Server Port
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/insurance_db
spring.datasource.username=root
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your_secret_key_here_make_it_at_least_256_bits_long_for_security
jwt.expiration=3600000
```

---

## 🚨 Emergency: If Nothing Works

**Last Resort - Command Line:**

```powershell
# Navigate to project
cd c:\Users\devil\OneDrive\Desktop\New-Project\InsureX\InsuranceManagement System

# If you have Java 17+
java -jar target/management-0.0.1-SNAPSHOT.jar

# If JAR doesn't exist, need Maven
# Install Maven first, then:
mvn clean package
java -jar target/management-0.0.1-SNAPSHOT.jar
```

---

## ✅ Success Indicators

**✅ Backend running correctly when:**
1. Console shows "Started InsuranceApplication"
2. No red errors in console
3. Port 8080 is listening
4. Health endpoint returns UP
5. Frontend can connect

**Then test:**
1. Go to frontend: http://localhost:3000
2. Try registration
3. Try login
4. Everything should work! 🎉

---

## 📝 Remember

- **Use IDE** → Easiest method
- **Install Lombok plugin** → Essential
- **Enable annotation processing** → For IntelliJ
- **Check MySQL running** → Database required
- **Wait for indexing** → First time setup

---

**Most users succeed with:**
1. Open IntelliJ
2. Open InsuranceManagementSystem project
3. Install Lombok plugin if needed
4. Right-click InsuranceApplication.java → Run
5. Done! ✅

---

Need more help? Check:
- IntelliJ Logs: Help → Show Log in Explorer
- Eclipse Logs: Workspace/.metadata/.log
- Console output for specific errors
