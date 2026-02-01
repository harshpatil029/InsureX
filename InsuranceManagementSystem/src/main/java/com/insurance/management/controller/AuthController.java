package com.insurance.management.controller;

import com.insurance.management.dto.LoginRequestDTO;
import com.insurance.management.dto.RegisterRequestDTO;
import com.insurance.management.dto.ForgotPasswordRequestDTO;
import com.insurance.management.dto.ResetPasswordRequestDTO;
import com.insurance.management.dto.ApiResponse;
import com.insurance.management.dto.AuthResponseDTO;
import com.insurance.management.services.AuthService;
import com.insurance.management.services.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        String response = authService.register(registerRequest);
        return ResponseEntity.ok(new ApiResponse("Success", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        try {
            passwordResetService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(new ApiResponse("Success", "Password reset link has been sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new ApiResponse("Success",
                    "Password has been reset successfully. You can now login with your new password."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error", e.getMessage()));
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        if (isValid) {
            return ResponseEntity.ok(new ApiResponse("Success", "Token is valid"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Error", "Invalid or expired token"));
        }
    }
}
