# Forgot Password Feature - Setup Guide

## ✅ Feature Implemented

The forgot password feature has been successfully added to InsureX with the following components:

### Backend Components:
1. **PasswordResetToken Entity** - Stores reset tokens with expiry
2. **PasswordResetService** - Handles token generation and validation
3. **EmailService** - Sends password reset emails
4. **API Endpoints**:
   - `POST /auth/forgot-password` - Request password reset
   - `POST /auth/reset-password` - Reset password with token
   - `GET /auth/validate-reset-token` - Validate token

### Frontend Components:
1. **ForgotPassword Page** (`/forgot-password`) - Email input form
2. **ResetPassword Page** (`/reset-password?token=xxx`) - New password form
3. **Login Page** - Added "Forgot Password?" link

---

## 📧 Email Configuration Required

To enable email sending, you need to configure Gmail SMTP in `application.properties`:

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the 16-character password

### Step 2: Update application.properties

Open `InsuranceManagementSystem/src/main/resources/application.properties` and update:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Application URL for password reset links
app.url=http://localhost:3000
```

**Replace:**
- `YOUR_EMAIL@gmail.com` with your Gmail address
- `YOUR_16_CHAR_APP_PASSWORD` with the app password from Step 1

---

## 🗄️ Database Migration

The password reset feature requires a new table. Run this SQL:

```sql
CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Or simply **restart your Spring Boot application** - it will auto-create the table if you have `spring.jpa.hibernate.ddl-auto=update` in your properties.

---

## 🧪 How to Test

### 1. Request Password Reset
1. Go to `http://localhost:3000/login`
2. Click **"Forgot Password?"**
3. Enter your email (e.g., `admin@insurex.com`)
4. Click **"Send Reset Link"**
5. Check your email inbox

### 2. Reset Password
1. Open the email and click the reset link
2. You'll be redirected to `/reset-password?token=xxx`
3. Enter your new password (min 6 characters)
4. Confirm the password
5. Click **"Reset Password"**
6. You'll be redirected to login

### 3. Login with New Password
1. Go to `/login`
2. Use your email and new password
3. Success!

---

## 🔒 Security Features

- ✅ Tokens expire after 1 hour
- ✅ Tokens can only be used once
- ✅ Old tokens are deleted when new ones are generated
- ✅ Passwords are BCrypt hashed
- ✅ Token validation before password reset
- ✅ Proper error messages for invalid/expired tokens

---

## 🎨 UI Features

- ✅ "Forgot Password?" link on login page
- ✅ Clean, user-friendly forms
- ✅ Loading states and spinners
- ✅ Success/error feedback
- ✅ Auto-redirect after successful reset
- ✅ Invalid token handling

---

## 📝 Email Template

Users will receive an email like this:

```
Subject: InsureX - Password Reset Request

Hello,

You have requested to reset your password for your InsureX account.

Please click the link below to reset your password:
http://localhost:3000/reset-password?token=xxx-xxx-xxx

This link will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
InsureX Team
```

---

## 🚀 Next Steps

1. **Configure Gmail** (see Step 2 above)
2. **Restart Backend** to create the database table
3. **Test the feature** using the steps above

---

## ⚠️ Important Notes

- **Gmail Security**: Use app-specific passwords, not your main Gmail password
- **Production**: For production, use a dedicated email service like SendGrid or AWS SES
- **Token Expiry**: Tokens expire in 1 hour (configurable in `PasswordResetService.java`)
- **Rate Limiting**: Consider adding rate limiting to prevent abuse

---

## 🎉 Feature Complete!

The forgot password feature is now fully integrated and ready to use!
